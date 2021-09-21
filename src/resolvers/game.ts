// import { Post } from "../entities/Post";
import { User } from "../entities/User";
// import { Game } from "../entities/Game";
import {Resolver, Query, Ctx, Arg, Int, UseMiddleware, ObjectType, Field} from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../isAuth";
import { Platform } from '../entities/Platform'
import { get_game } from "../igdb_helper";

@ObjectType()
class GamesResponse {
    @Field(() => [Game_igdb], {nullable: true})
    games?: Game_igdb[]

    @Field(() => Number, {nullable: true})
    total?: Number

    @Field(() => Number, {nullable: true})
    total_consoles?: Number
}

@ObjectType()
class Cover {
    @Field()
    id:            number;
    @Field()
    alpha_channel: boolean;
    @Field()
    animated:      boolean;
    @Field()
    game:          number;
    @Field()
    height:        number;
    @Field()
    image_id:      string;
    @Field()
    url:           string;
    @Field()
    width:         number;
    @Field()
    checksum:      string;
}
@ObjectType()
class Genre {
    @Field()
    id:         number;
    @Field()
    created_at: number;
    @Field()
    name:       string;
    @Field()
    slug:       string;
    @Field()
    updated_at: number;
    @Field()
    url:        string;
    @Field()
    checksum:   string;
}
@ObjectType()
class Platform_igdb {
    @Field()
    id:               number;
    @Field()
    abbreviation:     string;
    @Field()
    alternative_name: string;
    @Field()
    category:         number;
    @Field()
    created_at:       number;
    @Field()
    name:             string;
    @Field()
    platform_logo:    number;
    @Field()
    slug:             string;
    @Field()
    updated_at:       number;
    @Field()
    url:              string;
    @Field(() => [Number])
    versions:         number[];
    @Field()
    checksum:         string;
}
@ObjectType()
class ReleaseDate {
    @Field()
    id:         number;
    @Field()
    category:   number;
    @Field()
    created_at: number;
    @Field()
    date:       number;
    @Field()
    game:       number;
    @Field()
    human:      string;
    @Field()
    m:          number;
    @Field()
    platform:   number;
    @Field()
    region:     number;
    @Field()
    updated_at: number;
    @Field()
    y:          number;
    @Field()
    checksum:   string;
}

@ObjectType()
class Game_igdb{
    @Field()
    id:            number;
    @Field()
    cover:         Cover;
    @Field(() => [Genre])
    genres:        Genre[];
    @Field()
    name:          string;
    @Field(() => [Platform_igdb])
    platforms:     Platform_igdb[];
    @Field(() => [ReleaseDate])
    release_dates: ReleaseDate[];
    @Field()
    summary:       string;
}





@Resolver()
export class GameResolver {
    @Query(() => GamesResponse)
    @UseMiddleware(isAuth)
    async user_games_consoles(
        @Ctx() {em, payload}: MyContext
    ): Promise<GamesResponse> {
        const user = await em.findOne(User, { id: payload!.userId });
        const platforms = await em.find(Platform, { owner: user });
        let consoles:[String]
        let games:any
        platforms.forEach((item) => {
            if (!consoles.includes(item.platform_name)){
                consoles.push(item.platform_name);
            }

            //add in information to do a bulk call for the end game info

            if (!games.hasOwnProperty(item.platform_name)){
                games[item.platform_name] = [item.game]
            }else{
                games[item.platform_name].push(item.game)
            }
        })
        return {
            games: games,
            total: platforms.length,
            total_consoles: Object.keys(games).length
        }
    }

    //reply with data from api endpoint for game
    @Query(() => Game_igdb)
    @UseMiddleware(isAuth)
    async game(
        @Arg("game_id", () => Int) id: number,
    ): Promise<Game_igdb | null> {
        // const game = await em.findOne(Game, { id: id });
        // if (!game){
        //     return null
        // }
        const game_igdb = await get_game(id.toString())

        return game_igdb
    }

    // @Query(() => Post, {nullable: true})
    // @UseMiddleware(isAuth)
    // post(
    //     @Arg("id", () => Int) id: number,
    //     @Ctx() {em}: MyContext
    // ): Promise<Post | null> {
    //     return em.findOne(Post, { id });
    // }

    // @Mutation(() => Post)
    // @UseMiddleware(isAuth)
    // async createPost(
    //     @Arg("content") content: string,
    //     @Arg("likes") likes: number,
    //     @Ctx() {em}: MyContext
    // ): Promise<Post> {
    //     const post = em.create(Post, {content, likes})
    //     await em.persistAndFlush(post)
    //     return post;
    // }
    
    // @Mutation(() => Post, {nullable: true})
    // @UseMiddleware(isAuth)
    // async updatePost(
    //     @Arg("id") id: number,
    //     @Arg("likes") likes: number,
    //     @Ctx() {em}: MyContext
    // ): Promise<Post | null> {
    //     const post = await em.findOne(Post, {id});
    //     if (!post) {
    //         return null
    //     }
    //     if (typeof likes !== 'undefined') {
    //         post.likes = likes;
    //         await em.persistAndFlush(post)
    //     }
    //     return post;
    // }

    // @Mutation(() => Boolean)
    // @UseMiddleware(isAuth)
    // async deletePost(
    //     @Arg("id") id: number,
    //     @Ctx() { em }: MyContext
    // ): Promise<boolean> {
    //     try {
    //         await em.nativeDelete(Post, { id })
    //         return true;
    //     } catch {
    //         return false
    //     }
    // }
}