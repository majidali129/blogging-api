import { Router } from "express";
import {authRouter} from "./auth.routes";
import { postRouter } from "./post.routes";
import { commentsRouter } from "./comment-routes";
import { bookmarkRotuer } from "./bookmark-routes";
import { userRouter } from "./user-routes";


export const appRouter = Router()
appRouter.use('/auth', authRouter);
appRouter.use('/posts', postRouter)
appRouter.use('/comments', commentsRouter)
appRouter.use('/bookmarks', bookmarkRotuer)
appRouter.use('/users', userRouter)
