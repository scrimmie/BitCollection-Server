import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants";
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import 'dotenv/config'
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entities/User";
import { createAccessToken } from './auth'

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();
    app.use(cookieParser())

    app.post("/refresh_token", async (req, res) => {
        const refreshToken = req.cookies.jid
        if (!refreshToken){
            return res.send({ ok: false, accessToken: ''})
        }
        
        let payload: any = null;
        try {
            payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
        }catch(err){
            console.log(err)
            return res.send({ ok: false, accessToken: ''})
        }

        const user = await orm.em.findOne(User, {id : payload.userId} )

        if (!user){
            return res.send({ ok: false, accessToken: ''})
        }

        return res.send({ ok: true, accessToken: createAccessToken(user)})
    })
   
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ em: orm.em, req: req, res: res})
    });

    await apolloServer.start(); 
    apolloServer.applyMiddleware({ app })

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })
}


main().catch((err) => {
    console.log(err)
});