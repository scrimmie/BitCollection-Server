"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const path_1 = __importDefault(require("path"));
const config = {
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post_1.Post],
    dbName: 'bitcollection',
    type: 'postgresql',
    clientUrl: 'postgresql://mac-plex.local:5432',
    debug: !constants_1.__prod__,
    user: 'postgres',
    password: 'postgres'
};
exports.default = config;
//# sourceMappingURL=mikro-orm.config.js.map