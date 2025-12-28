import { config } from '@/config'
import {SignJWT, jwtVerify} from 'jose'


type Payload = { userId: string, username: string }

export const generateAccessToken = async (payload: Payload) => {
    const accessTokenKey = new TextEncoder().encode(config.ACCESS_TOKEN_SECRET);
    return await new SignJWT(payload).setProtectedHeader({alg: "HS256"}).setExpirationTime(config.ACCESS_TOKEN_EXPIRY).sign(accessTokenKey)
}

export const generateRefreshToken = async (userId: string) => {
     const refreshTokenKey = new TextEncoder().encode(config.REFRESH_TOKEN_SECRET);
    return await new SignJWT({userId}).setProtectedHeader({alg: "HS256"}).setExpirationTime(config.REFRESH_TOKEN_EXPIRY).sign(refreshTokenKey)
 }

export const verifyToken = async (token: string, type: 'access' | 'refresh') => {
    const secret = type === 'access' ? config.ACCESS_TOKEN_SECRET : config.REFRESH_TOKEN_SECRET;
    const tokenKey = new TextEncoder().encode(secret);

    return await jwtVerify(token, tokenKey);
 }