import { v2 } from "cloudinary";

const cloudinaryConfig = v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDNAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDAPIKEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARYSECRET,
  secure: true,
});

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = v2.utils.api_sign_request(
        {
          timestamp: timestamp,
        },
        cloudinaryConfig.api_secret
      );

      res.status(200).json({ success: true, timestamp, signature });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    res.status(400).json({ success: false });
  }
}
