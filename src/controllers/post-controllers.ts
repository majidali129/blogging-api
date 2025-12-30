import { isOwner } from "@/helpers/is-owner";
import { slugify } from "@/helpers/slugify";
import { uploadToCloudinary } from "@/helpers/upload-to-cloudinary";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { apiResponse } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";
import { newPostSchema, updatePostSchema } from "@/utils/zod/post-schema";
import fs from 'fs'


export const createPost = asyncHandler(async (req, res) => {
    const postData = newPostSchema.parse(req.body);
    const slug = slugify(postData.title);


    let coverImage: { id: string, url: string } | null = null;
    if (req.file) {
        const result = await uploadToCloudinary(req.file.path, 'cover-images');
        coverImage = { id: result.public_id, url: result.secure_url };
        fs.unlinkSync(req.file.path);
    }


    const newPost = {
        ...postData,
        slug,
        authorId: req.user.userId,
        coverImage
    }

    console.log('newPost:',newPost)

    await prisma.post.create({
        data: newPost
    })

    return apiResponse(res, 201, 'Post created successfully',newPost)
})

export const uploadCoverPhoto = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    if (!req.file) throw new ApiError(400, 'Missing profile photo');
    
    const uploadResult = await uploadToCloudinary(req.file.path, 'cover-images');
    fs.unlinkSync(req.file.path);

    await prisma.post.update({
        where: { id: postId },
        data: {
            coverImage: {
                id: uploadResult.public_id.split('/').pop()!,
                url: uploadResult.secure_url
            },
            updatedAt: new Date()
        }
    })
    
    return apiResponse(res, 200, 'Cover image uploaded successfully')
})

export const removeCoverPhoto = asyncHandler(async (req, res) => {
    const imageId = req.params.imageId
    const postId = req.params.id;


    await cloudinary.uploader.destroy(`blogging/cover-images/${imageId}`)

    await prisma.post.update({
        where: { id: postId },
        data: {
            coverImage: null,
            updatedAt: new Date()
        }
    })

    return apiResponse(res, 200, 'Cover image removed successfully')
})

export const updatePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const postData = updatePostSchema.parse(req.body)
    const existingPost = await prisma.post.findUnique({where: {id: postId}})

    if (!existingPost) throw new ApiError(404, 'Post not found');

    if(!isOwner(existingPost.authorId, req.user.userId)) throw new ApiError(403, 'You are not authorized to update this post');

    let slug = postData.title ? slugify(postData.title) : existingPost.slug;
    

    let coverImage = existingPost.coverImage;
    if (req.file) {
        const result = await uploadToCloudinary(req.file.path, 'cover-images');
        const newCoverImage = { id: result.public_id.split('/').pop()!, url: result.secure_url };
        fs.unlinkSync(req.file.path);

        if (coverImage) {
            await cloudinary.uploader.destroy(`blogging/cover-images/${coverImage.id}`);
            coverImage = newCoverImage;
        }
    }

    await prisma.post.update({
        where: {id: postId},
        data: {
            ...postData,
            slug,
            coverImage,
            updatedAt: new Date()
        }
    })

    return apiResponse(res, 200, 'Post updated successfully')
})

export const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const existingPost = await prisma.post.findUnique({ where: { id: postId } })
    if (!existingPost) throw new ApiError(404, 'Post not found');

    if (!isOwner(existingPost.authorId, req.user.userId)) throw new ApiError(403, 'You are not authorized to delete this post');

    if (existingPost.coverImage) {
        await cloudinary.uploader.destroy(existingPost.coverImage.id)
    }

    await prisma.post.delete({ where: { id: postId } })

    return apiResponse(res, 200, 'Post deleted successfully')
})

export const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            coverImage: true,
            isMemberOnly: true,
            author: {
                select: {
                    id: true,
                    username: true,
                    profileImage: true
                }
            },
            createdAt: true,
            updatedAt: true,
            _count: {
                select: {
                    comments: true,
                    likes: true,
                    bookmarks: true
                }
            }
       }
    });

    return apiResponse(res, 200, 'Posts fetched successfully', posts)
})


export const getPostDetails = asyncHandler(async (req, res) => {
    const postId = req.params.id
    const post = await prisma.post.findUnique({
        where: { id: postId }, include: {
            author: {
                select: {
                    id: true,
                    username: true,
                    profileImage: true
                },
        }
            ,
            comments: true,
            _count: {
                select: {
                    comments: true,
                    bookmarks: true,
                    likes: true
                }
            }
    }});

    if (!post) throw new ApiError(404, 'Post not found');   
    return apiResponse(res, 200, 'Post fetched successfully', post)
})


