import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'

// Configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
	try{
		if(!localFilePath)
			return null;
		const res = await cloudinary.uplaoder.upload(localFilePath, {
			retsource_type: 'auto',
		})
		console.log("File has been sucessfully uploaded on cloudinary");
		// FIle has been successfully uploaded
		// then unlink the file from system
		fs.unlinkSync(localFilePath)
		return res;
	} catch (err){
		// unlink the locaolly stored file as the upload operation got failed
		return null;
	}
}
export {uploadOnCloudinary};
