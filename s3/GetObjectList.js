import { S3Client, ListObjectsCommand} from "@aws-sdk/client-s3";
import {ACCESS_ID, SECRET_KEY, BUCKET, REGION} from "@env";
import {useState, useEffect} from 'react';

//s3 hook
const useDailyUploadsList = (props) => {
  const [list,setList] = useState([]);
  useEffect(()=>{
    getTodaysUploads(props);
  },[]);
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
      setList(await client.send(new ListObjectsCommand(bucketParams)));
    }catch(err){
      console.log("Error",err);
    }
  }
  return list;
}
export default useDailyUploadsList;


/*
const useDailyUploadsList = (props) => {

    console.log("getting uploads for selected day -> ",props);

    const [list, setList] = useState([]);
    const [amList,setAMList] = useState(null);
    const [pmList,setPMList] = useState(null);

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
      });


    let client = new S3Client({
        region: REGION,
        credentials: {
          accessKeyId : ACCESS_ID,
          secretAccessKey: SECRET_KEY,
        }
      });

    const getTodaysUploads = async() => {
      try{
        console.log("the prefix is -> ", props);
        const bucketParams = {Bucket: BUCKET, Prefix: props};
        return client.send(new ListObjectsCommand(bucketParams));
      }catch(err){
        console.log("Error",err);
      }
    }
    var data = {};
    data.lists = [];      
    if (amList && amList.length!=0){
      data.lists[data.lists.length] = amList; 
    }
    if(pmList && pmList.length!=0){
      data.lists[data.lists.length] = pmList;
    }
    return data;
    
      
};
export default useDailyUploadsList;
*/