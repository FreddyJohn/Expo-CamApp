import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native-web';
//import { useDeviceOrientation } from '@react-native-community/hooks';
import { StyleSheet, FlatList, SafeAreaView, View, TouchableHighlight, Text, Fil } from "react-native";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { S3Client, ListObjectsCommand, GetObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl, S3RequestPresigner} from "@aws-sdk/s3-request-presigner";
import {ACCESS_ID, SECRET_KEY} from "@env";
import React, {useState, useEffect} from 'react';
import {Video} from 'expo-av';
import { HttpRequest } from '@aws-sdk/protocol-http';
import {Sha256} from "@aws-crypto/sha256-browser"
import { formatUrl } from '@aws-sdk/util-format-url';
import { Linking } from "react-native";

export default function App() {
  //import { Hash } from "@aws-sdk/hash-node";
  const [list, setList] = useState([]);
  const [status, setStatus] = React.useState({});
  const [blob, setBlob] = React.useState({});

  useEffect(()=>{
    console.log(list);
  },[list]);
  
  useEffect(()=> {
    run().then(data => {
      let array = data.Contents.map(element => element.Key);
      setList(array);
    });
    },[]);
  
  let client = new S3Client({
    region: "us-west-2",
    credentials: {
      accessKeyId : ACCESS_ID,
      secretAccessKey: SECRET_KEY,
    }
  });

  const month = new Date().getMonth() + 1; 
  const year = new Date().getFullYear();
  const day = new Date().getDate();
  const path = year+"/"+month+"/"+day;
  console.log("this is the path for today ",path);
  const bucketParams = {Bucket: "front.cam.storage", Prefix: path};
  
  const run = async() => {
    try{
      return client.send(new ListObjectsCommand(bucketParams));
    }catch(err){
      console.log("Error",err);
    }
  }
  /*
  function getUrl(key){
    return client.send(new GetObjectCommand({Bucket: "front.cam.storage", Key: key})).then(command => {
      return getSignedUrl(client,command,{expiresIn:3600});
    }).catch(console.error);
  }
  */
  const getUrl = async (key) => {
    try {
      let url = await getSignedUrl(
        client,
        new GetObjectCommand({
          Bucket: "front.cam.storage",
          Key: key,
        }),
        { expiresIn: 3600 }
      );
  
     // const supported = await Linking.canOpenURL(url);
     // if (supported) {
     //   await Linking.openURL(url);
     // }
      
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
          source={{uri : blob}}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlayBackStatusUpdate={status=> setStatus(()=>status)}/>
      </View>
      <FlatList
      data={list}
      keyExtractor={item => item}
      renderItem={({item}) => (
        <TouchableHighlight 
          onPress={() => getUrl(item).then(url => {
            console.log(url);
            setBlob(url);
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }).catch(getUrl(console.error))}> 
          <View style={{backgroundColor: 'white'}}>
            <Text>{item}</Text>
          </View>
        </TouchableHighlight>)}
      />
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
  }
});

  