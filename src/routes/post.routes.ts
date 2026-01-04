import { createPost, deletePost, getAllPosts, getPostDetails, removeCoverPhoto, updatePost, uploadCoverPhoto } from "@/controllers/post-controllers";
import { verifyRequest } from "@/middleware/verify-request";
import { Router } from "express";
import {commentsRouter} from './comment-routes'
import { upload } from "@/lib/multer";
import { bookmarkRotuer } from "./bookmark-routes";


const router = Router()

// router.route('/:view').post(verifyRequest, upload.single('coverImage'), createPost).get(getAllPosts)
router.post('/', verifyRequest, upload.single('coverImage'), createPost);
router.get('/', getAllPosts) // 

const views = ['/week', '/month', '/year', '/latest', '/infinity', '/following', '/discover']
// router.get(`/view/monthly`, getAllPosts)

router.use('/:postId/comments', commentsRouter)
router.use('/:postId/comments/:id', commentsRouter)
router.use('/:postId/bookmarks', bookmarkRotuer)
router.use('/:postId/bookmarks/:id', bookmarkRotuer)

router.use(verifyRequest)
router.route('/:id').put(upload.single('coverImage'), updatePost).get(getPostDetails).delete(deletePost)

router.put('/:id/cover-image', upload.single('coverImage'), uploadCoverPhoto)
router.delete('/:id/cover-image/:imageId', removeCoverPhoto)



export {router as postRouter}
export default router