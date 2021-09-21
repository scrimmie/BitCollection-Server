import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { Game } from "../entities/Game";
import {Resolver, Query, Ctx, Arg, Int, Mutation, UseMiddleware} from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../isAuth";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    @UseMiddleware(isAuth)
    async user_posts(
        @Ctx() {em, payload}: MyContext
    ): Promise<Post[]> {
        const user = await em.findOne(User, { id: payload!.userId });
        return em.find(Post, { author: user });
    }

    @Query(() => [Post])
    @UseMiddleware(isAuth)
    async game_posts(
        @Arg("game_id", () => Int) id: number,
        @Ctx() {em}: MyContext
    ): Promise<Post[]> {
        const game = await em.findOne(Game, { id: id });
        return em.find(Post, { game: game });
    }

    @Query(() => Post, {nullable: true})
    @UseMiddleware(isAuth)
    post(
        @Arg("id", () => Int) id: number,
        @Ctx() {em}: MyContext
    ): Promise<Post | null> {
        return em.findOne(Post, { id });
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("content") content: string,
        @Arg("likes") likes: number,
        @Ctx() {em}: MyContext
    ): Promise<Post> {
        const post = em.create(Post, {content, likes})
        await em.persistAndFlush(post)
        return post;
    }
    
    @Mutation(() => Post, {nullable: true})
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg("id") id: number,
        @Arg("likes") likes: number,
        @Ctx() {em}: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, {id});
        if (!post) {
            return null
        }
        if (typeof likes !== 'undefined') {
            post.likes = likes;
            await em.persistAndFlush(post)
        }
        return post;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg("id") id: number,
        @Ctx() { em }: MyContext
    ): Promise<boolean> {
        try {
            await em.nativeDelete(Post, { id })
            return true;
        } catch {
            return false
        }
    }
}