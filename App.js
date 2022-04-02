import { 
  StyleSheet,
  SafeAreaView, 
} from "react-native";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import React, {useState} from 'react';

import {ListVideo} from './components/ListVideo'


export default function App() {

  function getPath(){
    const month = new Date().getMonth() + 1; 
    const year = new Date().getFullYear();
    const day = new Date().getDate();
    const path = year+"/"+month+"/"+day+"/";
    console.log("the day today is -> ", path);
    return path;
  }
  return (
    <SafeAreaView style={{    
      backgroundColor: "#303734",
      height:"100%",
      width: "100%"}}>
      <ListVideo path = {getPath()}/>
    </SafeAreaView>
  );
}






