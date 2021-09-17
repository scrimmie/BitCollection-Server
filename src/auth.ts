import { User } from './entities/User';
import { sign } from 'jsonwebtoken';

export const createAccessToken = (user: User) => {
    return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: "15min"});
};

export const createRefreshToken = (user: User) => {
    return sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, {expiresIn: "30d"});
};