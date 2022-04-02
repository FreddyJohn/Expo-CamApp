import { S3Client, ListObjectsCommand} from "@aws-sdk/client-s3";
import {ACCESS_ID, SECRET_KEY, BUCKET, REGION} from "@env";

//s3 hook
const useDailyUploadsList = (props) => {
  let client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId : ACCESS_ID,
      secretAccessKey: SECRET_KEY,
    }
  });
  const getTodaysUploads = async(props) => {
    try{
      console.log("the prefix is -> ", props);
      const bucketParams = {Bucket: BUCKET, Prefix: props};
      return await client.send(new ListObjectsCommand(bucketParams));
    }catch(err){
      console.log("Error",err);
    }
  }
  return getTodaysUploads(props);
}
export default useDailyUploadsList;