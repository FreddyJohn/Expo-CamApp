import { S3Client, GetObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {ACCESS_ID, SECRET_KEY, BUCKET, REGION} from "@env";

//s3 hook
const useGetSignedUrl = (key) => {
    let client = new S3Client({
        region: REGION,
        credentials: {
          accessKeyId : ACCESS_ID,
          secretAccessKey: SECRET_KEY,
        }
      });
      const getUrl = async (key) => {
        try {
          let url = await getSignedUrl(
            client,
            new GetObjectCommand({
              Bucket: BUCKET,
              Key: key,
            }),
            { expiresIn: 3600 }
          );
          return url;
        } catch (error) {
          return error;
        }
      };
      return getUrl(key);
    
};
export default useGetSignedUrl;
