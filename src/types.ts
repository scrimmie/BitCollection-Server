import { IDatabaseDriver, Connection, EntityManager } from "@mikro-orm/core";
import { Response, Request } from 'express'


export interface MyContext {
    em: EntityManager<IDatabaseDriver<Connection>>,
    req: Request,
    res: Response,
    payload?: {userId: number}
}