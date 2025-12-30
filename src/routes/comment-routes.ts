import { createComment, deleteComment, getCommentDetails, getPostComments, replyToComment, updateComment } from "@/controllers/comment-controller";
import { verifyRequest } from "@/middleware/verify-request";
import { Router } from "express";


const router = Router({mergeParams: true})


router.use(verifyRequest)
router.route('/').post(createComment).get(getPostComments)

router.route('/:id').get(getCommentDetails).put(updateComment).delete(deleteComment).post(replyToComment)


export { router as commentsRouter }
export default router