import { addPostToBookmark, getAllUserBookmarks, removePostFromBookmark } from "@/controllers/bookmark-controller";
import { verifyRequest } from "@/middleware/verify-request";
import { Router } from "express";


const router = Router({ mergeParams: true })

router.use(verifyRequest)
router.route('/').post(addPostToBookmark).get(getAllUserBookmarks)
router.route('/:id').delete(removePostFromBookmark)




export {router as bookmarkRotuer}
export default router;