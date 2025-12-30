import { asyncHandler } from "@/utils/async-handler";
import { checkUsernameInput, signInInput, signUpInput } from "@/utils/zod/auth-schema";
import { Request, Response } from "express";
import  bcrypt from 'bcrypt'
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/utils/api-response";
import { ApiError } from "@/utils/api-error";
import { generateAccessToken, generateRefreshToken, verifyToken } from "@/utils/jwts";
import { config } from "@/config";


const handleTokenAssignment =async (res: Response,id: string, username: string) => {
    const accessToken = await generateAccessToken({userId: id, username})
    const refreshToken = await generateRefreshToken(id)
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);


    res.cookie('access-token', accessToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production'
        ,sameSite: 'strict'
        , maxAge: 24 * 60 *60*1000 // 1 day
    })
    res.cookie('refresh-token', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: config.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    });


    return {accessToken, refreshToken, hashedRefreshToken};
}

export const signUp = asyncHandler(async (req: Request, res: Response) => {
    const {password, ...restData} = signUpInput.parse(req.body)

    const existingUserWithEmail = await prisma.user.findUnique({
        where: { email: restData.email },
        select: { id: true }
    });

    if(existingUserWithEmail) throw new ApiError(400, 'Email is already registered');

    const existingUserWithUsername =  await prisma.user.findUnique({
        where: { username: restData.username },
        select: { id: true }
    });

    if(existingUserWithUsername) throw new ApiError(400, 'Username is already taken');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { ...restData, password: hashedPassword },
        select: {
            id: true,
            username: true
        }
    })

    // TODO: Send verification email

    return apiResponse(res, 201, 'Account created successfully', user);

})
 
export const checkUsernameAvailability = asyncHandler(async (req: Request, res: Response) => {
    const { username } = checkUsernameInput.parse(req.body);

    const existingUser = await prisma.user.findUnique({
        where: {username}
        ,select: {id: true}
    })

    if (existingUser) throw new ApiError(400, 'Username is already taken');
    
    return apiResponse(res, 200, 'Username is available', {username})
})



export const signIn = asyncHandler(async (req: Request, res: Response) => { 
    const {email, password} = signInInput.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, username: true, password: true } });
    if (!user) throw new ApiError(400, 'Invalid email or password')
    
    // TODO: CHECK IF EMAIL IS VERIFIED

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new ApiError(400, 'Invalid email or password');

    const {hashedRefreshToken} = await  handleTokenAssignment(res, user.id, user.username)
    
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: hashedRefreshToken, isActive: true, lastLoginAt: new Date() } })
    
    return apiResponse(res, 200, 'Signed in successfully', { username: user.username });
})

export const signOut = asyncHandler(async (req: Request, res: Response) => { 
    const userId = req.user.userId;

    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null, isActive: false } });

    res.clearCookie('access-token', { path: '/' });
    res.clearCookie('refresh-token', {path: '/'})


    return apiResponse(res, 200, 'Signed out successfully');
})

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({where: {id: userId}, select: {id:true, username: true, email: true, fullName: true}})

    if(!user) throw new ApiError(404, 'User not found');

    return apiResponse(res, 200, 'Current user fetched successfully', user)
 })
export const refreshToken = asyncHandler(async (req: Request, res: Response) => { 
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) throw new ApiError(401, 'Unauthorized Access. Please login to proceed');

    const decodedToken = await verifyToken(refreshToken, 'refresh');
    const {userId} = decodedToken.payload as {userId: string}
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true, refreshToken: true } });

    if(!user) throw new ApiError(401, 'Unauthorized Access. Please login to proceed');
    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken || '');

    if(!isRefreshTokenValid) throw new ApiError(401, 'The refresh token has been used already, expired, or is invalid. Please login again');

   const {hashedRefreshToken} = await handleTokenAssignment(res, user.id, user.username)

        await prisma.user.update({ where: { id: user.id }, data: { refreshToken: hashedRefreshToken } });


    return apiResponse(res, 200, 'Token refreshed successfully');

 })