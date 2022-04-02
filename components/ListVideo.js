import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native-web';
import React, {useEffect} from 'react';
import { View, Text, FlatList, TouchableHighlight, StyleSheet} from 'react-native';
import useGetSignedUrl from '../s3/GetSignedUrl';
import useDailyUploadsList from '../s3/GetObjectList';
import useFormat from '../util/Format';
import {Video} from 'expo-av';
import { Calendar } from 'react-native-calendars';

const VideoSelection = ({ title,calendar,state}) => {
  return(
  <View style={styles.container}>
    {!state ? calendar : title}
  </View>
  )
}
//functional component
export const ListVideo = (props) => {
    const [status,setStatus] = React.useState([]);
    const [url,setUrl] = React.useState([]);
    const [bool,setBool] = React.useState([false]);
    const [data,setData] = React.useState([]);
    const [path,setPath] = React.useState(props.path);
    
    useEffect(()=>{
      useDailyUploadsList(path).then(unformattedData =>{
        const formattedData = useFormat(unformattedData);
        console.log(formattedData);
        setData(formattedData);
      });
    },[path]);

    const video = React.useRef(null);
    return (
        <View>
            <Video
            ref={video}
            source={{uri : url}}
            style={{width:"100%", height:"60%"}}
            useNativeControls
            resizeMode="contain"
            isLooping
            onPlayBackStatusUpdate={status=> setStatus(()=>status)}/>
          <View style={styles.list}>
            <Text onPress={()=>{setBool(false); console.log(bool);}}>
              {path.substring(0,path.lastIndexOf("/")).replaceAll("/","-")}
            </Text>
          </View>
          <VideoSelection title={data.lists?.map((list) => 
            <FlatList
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={ItemDivider}
                ListHeaderComponent={()=><Text>{"tod"}</Text>}
                data={list}
                renderItem={({item}) => (
                <TouchableHighlight
                onPress={() => useGetSignedUrl(item.value).then(data =>{
                  setUrl(data);
                  status.isPlaying ? video.current.pauseAsync() : video.current.playAsync();
                  console.log(item,url);
                  })}> 
                    <View>
                        <Text>{item.key}</Text>
                    </View>
                </TouchableHighlight>)}
              />)} 
                calendar = {<Calendar
                onDayPress={day =>{
                  const formattedDay = day.year+"/"+day.month+"/"+day.day+"/";
                  console.log(day);
                  setPath(formattedDay);
                  setBool(true);}
                }></Calendar>}
                state={bool}
                />
        </View>
    );
};
const ItemDivider = () => {
    return (
      <View
        style={{
          height: 7,
          width: "100%",
          backgroundColor: "white",
        }}
      />
    );
}

const styles = StyleSheet.create({
    container: {
      flexDirection:"row",
      backgroundColor: '#fff',
      height: "30%",
      paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
      justifyContent: "space-evenly",
    },
    list: {
      alignItems: "center",
      flexGrow: 1,
    },});





































//class component
/*
class VideoList extends Component {
    
    constructor(props){
        super(props);
        const blah = getDailyUploadsList();
        console.log(blah);
    }
   

    render() {
        const reptiles = ["alligator", "snake", "lizard"];
        return(
            <View>
                {reptiles.map((reptile) => <Text>{reptile}</Text>)}
            </View>
        )
    }
    
}
export default VideoList;
*/