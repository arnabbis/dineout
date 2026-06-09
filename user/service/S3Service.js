import {S3Client,PutObjectCommand} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3Config = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
    }
});

export const uploadImageInS3 = async(file) =>{
    const fileName = `users/${Date.now()}-${file.originalname}`;
    await s3Config.send(new PutObjectCommand({
        Bucket:process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    }));

    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    console.log("✅ Image uploaded to S3:", imageUrl);
    return imageUrl;
}