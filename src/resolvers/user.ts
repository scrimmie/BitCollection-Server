import { MyContext } from "src/types";
import {Resolver, Mutation, Arg, InputType, Field, Ctx, ObjectType, Int, UseMiddleware} from "type-graphql";
import { User } from '../entities/User'
import argon2 from 'argon2'
import { createAccessToken, createRefreshToken } from '../auth'
import { wrap } from '@mikro-orm/core';
import { isAuth } from '../isAuth';

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class TokenResponse {
    @Field()
    accessToken: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User

    @Field(() => TokenResponse, {nullable: true})
    token?: TokenResponse
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async register(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse>{
        if (options.username.length <= 2){
            return {
                errors: [{
                    field: "username",
                    message: "length must be greater than 2"
                }]
            }
        }

        if (options.password.length <= 3){
            return {
                errors: [{
                    field: "password",
                    message: "length must be greater than 3"
                }]
            }
        }

        const hashedPasswd = await argon2.hash(options.password)
        const user = em.create(User, {username: options.username, password: hashedPasswd})
        try {
            await em.persistAndFlush(user)
        }catch(error){
            if (error.code === '23505'){
                return {
                    errors: [{
                        field: "username",
                        message: "This username is taken"
                    }]
                }
            }
        }
        
        return { user }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { em, res }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {username: options.username})
        if (!user) {
            return {
                errors: [{
                    field: "username",
                    message: "That username doesnt exist",
                },]
            }
        }
        const validPasswd = await argon2.verify(user.password, options.password)
        if (!validPasswd){
            return {
                errors: [{
                    field: "password",
                    message: "Incorrect Password",
                },]
            }
        }

        res.cookie('jid', createRefreshToken(user), {httpOnly: true,})

        return {
            user: user, 
            token: {accessToken: createAccessToken(user)}
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async revokeRefreshForUser(
        @Arg('userId', () => Int) userId: number,
        @Ctx() { em }: MyContext){ 
            let user = await em.findOne(User, { id: userId })
            if(!user){
                return false
            }
            wrap(user).assign({
                tokenVersion: user.tokenVersion + 1
            })
            await em.persistAndFlush(user)
            return true
        }

}