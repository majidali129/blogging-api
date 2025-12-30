import { followUser, getCurrentUserFollowers, getCurrentUserFollowings, unfollowUser } from "@/controllers/follow-account-controller";
import { verifyRequest } from "@/middleware/verify-request";
import { Router } from "express";


const router = Router()


router.use(verifyRequest)
router.route('/:id/profile')
router.route('/:id/follow').post(followUser).delete(unfollowUser);

router.get('/:id/followers', getCurrentUserFollowers)
router.get('/:id/followings', getCurrentUserFollowings)

//TODO: Add routes to get another user's followers and followings


export { router as userRouter }
export default router
