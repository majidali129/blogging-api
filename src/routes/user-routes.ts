import { followUser, getAllUsers, getUserPosts, getUserPostSeries, getUserProfile, unfollowUser } from "@/controllers/user-controller";
import { verifyRequest } from "@/middleware/verify-request";
import { Router } from "express";


const router = Router()

router.route('/').get(getAllUsers)
router.use(verifyRequest)
router.route('/:id/follow').post(followUser).delete(unfollowUser);
router.route('/:id/profile').get(getUserProfile)
router.route('/:id/posts').get(getUserPosts)
router.route('/:id/followers').get(getUserPosts)
router.route('/:id/followings').get(getUserPosts)
router.route('/:id/series').get(getUserPostSeries)


export { router as userRouter }
export default router
