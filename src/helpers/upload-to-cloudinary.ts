import { cloudinary } from "@/lib/cloudinary"
import { UploadApiResponse } from "cloudinary";
import fs from 'fs'




export const uploadToCloudinary = async (filePath:string, folderName: string) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `blogging/${folderName}`,
            resource_type: 'auto'
        })
        return result;
    } catch (error) {
        console.log(`Cloudinary upload Error:`, error)
        throw error;
    }
}

