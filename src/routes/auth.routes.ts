import { checkUsernameAvailability, getCurrentUser, refreshToken, signIn, signOut, signUp } from "@/controllers/auth-controllers";
import { verifyRequest } from "@/middleware/verify-request";
import { Router } from "express";


const router = Router()


router.route('/sign-up').post(signUp)
router.route('/check-username').post(checkUsernameAvailability)
router.route('/sign-in').post(signIn)
router.route('/refresh-token').get(refreshToken)
router.route('/sign-out').post(verifyRequest, signOut)
router.route('/me').get(verifyRequest, getCurrentUser)


export { router as authRouter }
export default router;