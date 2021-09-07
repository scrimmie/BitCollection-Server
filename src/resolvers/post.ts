import { Post } from "../entities/Post";
import {Resolver, Query} from "type-graphql";
import { isContext } from "vm";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(
        @Ctx() ctx: MyContext
    ) {
        return "bye"
    }
}