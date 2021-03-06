import { Options } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import path from 'path';
import { User } from "./entities/User";
import { Game } from "./entities/Game";
import { Platform } from "./entities/Platform";

const config: Options = {
        migrations: {
            path: path.join(__dirname, './migrations'), 
            pattern: /^[\w-]+\d+\.[tj]s$/,
        },
        entities: [Post, User, Game, Platform],
        dbName: 'bitcollection',
        type: 'postgresql',
        clientUrl: 'postgresql://mac-plex.local:5432',
        debug: !__prod__,
        user: 'postgres',
        password: 'postgres'
};

export default config;