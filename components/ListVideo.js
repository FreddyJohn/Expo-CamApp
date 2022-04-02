import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native-web';
import React, {useEffect} from 'react';
import { View, Text, FlatList, TouchableHighlight, StyleSheet} from 'react-native';
import useGetSignedUrl from '../s3/GetSignedUrl';
import useDailyUploadsList from '../s3/GetObjectList';
import useFormat from '../util/Format';
import {Video} from 'expo-av';
import { Calendar } from 'react-native-calendars';

const VideoSelection = ({ videoList,calendar,bool,data}) => {
  let content
  if(!bool){
    content=calendar
  }
  else if(bool && Object.keys(data)!=0){
    content=videoList
  }
  else if(Object.keys(data)==0){
    content=<Text>{"No videos for the selected date."}</Text>
  }  
  
  return(
  <View>
    {content}
  </View>
  )
}
const DateTitle = ({bool,title}) => {
  return(
  <View  style={styles.list}>
    {!bool ? null : title}
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

    /*
      moveout = cv2.VideoWriter(move_file, fourcc, 10.0, (640,480),True)
    */
    const video = React.useRef(null);
    return (
        <View style={styles.main}>
          <View>
            <Video
            ref={video}
            source={{uri : url}}
            style={{width:"100%", height:320}}
            useNativeControls
            resizeMode="stretch"
            isLooping
            onPlayBackStatusUpdate={status=> setStatus(()=>status)}/>
          </View>
          <DateTitle title={
            <Text onPress={()=>{setBool(false); console.log(bool);}}>
              {path.substring(0,path.lastIndexOf("/")).replaceAll("/","-")}
            </Text>}
            bool={bool}>
          </DateTitle>
          <VideoSelection videoList={
            <View style={styles.container}>{data.lists?.map((list) => 
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
                </View>} 
                calendar = {<Calendar
                style={styles.calendar}
                onDayPress={day =>{
                  const formattedDay = day.year+"/"+day.month+"/"+day.day+"/";
                  console.log(day);
                  setPath(formattedDay);
                  setBool(true);}
                }></Calendar>}
                bool={bool}
                data={data}
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
  main: {
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  container: {
    flexDirection:"row",
    backgroundColor: '#fff',
    height: "30%",
    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
    justifyContent: "space-evenly",
  },
  list: {
    alignItems: "center",
    flexGrow:1,

  },
  calendar: {
    height:"30%"

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