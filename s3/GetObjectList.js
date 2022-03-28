import { S3Client, ListObjectsCommand, GetObjectCommand} from "@aws-sdk/client-s3";
import {ACCESS_ID, SECRET_KEY, BUCKET, REGION} from "@env";
import React, {useState, useEffect} from 'react';

//s3 hook
const useDailyUploadsList = () => {
    
    const [list, setList] = useState([]);
    const [amList,setAMList] = React.useState(null);
    const [pmList,setPMList] = React.useState(null);
    const [dateTitle,setDateTitle] = React.useState(null);

    function getPath(){
        const month = new Date().getMonth() + 1; 
        const year = new Date().getFullYear();
        const day = new Date().getDate();
        const title = year+"-"+month+"-"+day;
        const path = year+"/"+month+"/"+day;
        setDateTitle(title);
        return path
      }

    function getFormatedData(array){
        var data = [];
        for(var i in array){
          const path = array[i];
          var dict = {};
          var key = path.substring(path.lastIndexOf("/"),path.length).replace("/","").replace(".mp4","");
          key = key.indexOf('0')!=0 ? key : key.replace('0','');
          dict["key"] = key;
          dict["value"] = path;
          data[i] = dict;
        }
        return data;
      }
      
    function setUploadDictionaries(array){
        let amArray = array.filter(key => key.includes("am"));
        let pmArray = array.filter(key => key.includes("pm"));
        const amUploads = getFormatedData(amArray);
        const pmUploads = getFormatedData(pmArray);
        setAMList(amUploads);
        setPMList(pmUploads);
      }
    

      useEffect(()=>{
      },[list]);
    
      
      useEffect(()=> {
        getTodaysUploads().then(data => {
          let array = data.Contents.map(element => element.Key);
          setUploadDictionaries(array);
          setList(array);
        });
        },[]);


    let client = new S3Client({
        region: REGION,
        credentials: {
          accessKeyId : ACCESS_ID,
          secretAccessKey: SECRET_KEY,
        }
      });

      const getTodaysUploads = async() => {
        try{
          path = getPath();
          const bucketParams = {Bucket: BUCKET, Prefix: path};
          return client.send(new ListObjectsCommand(bucketParams));
        }catch(err){
          console.log("Error",err);
        }
        
      }
      var data = {};
      data.date = dateTitle;
      data.lists = [amList,pmList];
      //return [amList,pmList];
      return data;
    
      
};
export default useDailyUploadsList;
