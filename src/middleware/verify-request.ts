import { ApiError } from "@/utils/api-error";
import { asyncHandler } from "@/utils/async-handler";
import { verifyToken } from "@/utils/jwts";


export const verifyRequest = asyncHandler(async (req, _res, next) => {
    const token = req.cookies['access-token'];
    if (!token) throw new ApiError(401, 'Unauthorized Access. Please login to proceed');
        const decodedToken = await verifyToken(token, 'access')
        const {userId, username} = decodedToken.payload as { userId: string, username: string };

        req.user = {
            userId,
            username
        }

        next()
        // if (error instanceof JWTInvalid) throw new ApiError(401, 'Invalid Token. Please login again')
        // else if(error instanceof JWTExpired) throw new ApiError(401, 'Session Expired. Please login again')
        // else throw new ApiError(500, 'Internal Server Error')
})