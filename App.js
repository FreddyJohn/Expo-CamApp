import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native-web';
import { 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  View, 
  TouchableHighlight,
  Text,
} from "react-native";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { S3Client, ListObjectsCommand, GetObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {ACCESS_ID, SECRET_KEY, BUCKET, REGION} from "@env";
import React, {useState, useEffect} from 'react';
import {Video} from 'expo-av';
import {Calendar
  , CalendarList
  , Agenda} from 'react-native-calendars';

export default function App() {


  const [list, setList] = useState([]);
  const [status, setStatus] = React.useState({});
  const [url, setUrl] = React.useState({});
  const [AMList,setAMList] = React.useState(null);
  const [PMList,setPMList] = React.useState(null);
  const [dateTitle,setDateTitle] = React.useState(null);

  function getPath(){
    const month = new Date().getMonth() + 1; 
    const year = new Date().getFullYear();
    const day = new Date().getDate();
    const title = year+"-"+month+"-"+day;
    const path = year+"/"+month+"/"+day;
    console.log(title)
    setDateTitle(title);
    return path
  }

  function getUploadDictionary(array){
    var data = [];
    for(var i in array){
      const path = array[i];
      var dict = {};
      dict["key"] = path.substring(path.lastIndexOf("/"),path.length).replace("/","").replace(".mp4","");
      dict["value"] = path;
      data[i] = dict;
    }
    return data;
  }

  function setUploadDictionaries(array){
    let amArray = array.filter(key => key.includes("am"));
    let pmArray = array.filter(key => key.includes("pm"));
    const amUploads = getUploadDictionary(amArray);
    const pmUploads = getUploadDictionary(pmArray);
    setAMList(amUploads);
    setPMList(pmUploads);
    console.log(amUploads);
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
  const video = React.useRef(null);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={{height: "50%",
                    width: "100%"}}>
        <Video
          ref={video}
          source={{uri : url}}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlayBackStatusUpdate={status=> setStatus(()=>status)}/>
      </View >
      <Text>
        {dateTitle}
      </Text>
      
      <View style={styles.uploadList}>
        <View style={styles.timeTitle}>
          <Text>{"AM"}</Text>
          <FlatList 
            data={AMList} 
            renderItem={({item}) => (
              <TouchableHighlight 
                onPress={() => getUrl(item.value).then(url => {
                  console.log(url);
                  setUrl(url);
                  status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                }).catch(getUrl(console.error))}> 
                <View style={{backgroundColor: 'white'}}>
                  <Text>{item.key}</Text>
                </View>
              </TouchableHighlight>)} />
        </View>
        <View style={styles.timeTitle}>
        <Text>{"PM"}</Text>
          <FlatList
          data={PMList}
          renderItem={({item}) => (
            <TouchableHighlight 
              onPress={() => getUrl(item.value).then(url => {
                console.log(url);
                setUrl(url);
                status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
              }).catch(getUrl(console.error))}> 
              <View style={{backgroundColor: 'white'}}>
                <Text>{item.key}</Text>
              </View>
            </TouchableHighlight>)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
    justifyContent: "center",
    alignItems: "center"
  },
  video : {
    height: "50%",
    width: "100%"
  },
  uploadList: {
    flexDirection: 'row',
  },
  timeTitle:{
    justifyContent: "center",
    alignItems: "center"
  }
});
