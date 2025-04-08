import { SESClient } from "@aws-sdk/client-ses";
import { PutObjectCommand, S3Client }  from "@aws-sdk/client-s3"; 
import NodeGeocoder from "node-geocoder";
import dotenv from 'dotenv';
dotenv.config();

export const DATABASE = process.env.DATABASE;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

export const EMAIL_FROM = process.env.EMAIL_FROM;
export const REPLY_TO = process.env.REPLY_TO;

// AWS SES client setup for AWS SDK v3
export const AWSSES = new SESClient({
    region: "eu-north-1",
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

// AWS S3 client setup for AWS SDK v3
export const AWSS3 = new S3Client({
    region: "eu-north-1",
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

export const PutObject = new PutObjectCommand({});

const options = {
    provider: "google",
    apiKey: process.env.API_KEY,
    formatter: null
};

export const GOOGLE_GEOCODER = NodeGeocoder(options);

export const JWT_SECRET = process.env.JWT_SECRET;
export const CLIENT_URL = "http://localhost:3000";
