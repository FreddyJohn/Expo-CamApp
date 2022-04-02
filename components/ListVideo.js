import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native-web';
import React, {useEffect} from 'react';
import { View, Text, SectionList, TouchableHighlight, StyleSheet} from 'react-native';
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
    content=<View style={{alignItems:"center"}}><Text>{"No videos for the selected date."}</Text></View>
  } 
  return(
  <View>
    {content}
  </View>
  )
}

const DateTitle = ({bool,title}) => {
  return(
  <View  style={styles.dateTitle}>
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
    const [table,setTable] = React.useState([]);
    
    useEffect(()=>{
      useDailyUploadsList(path).then(unformattedData =>{
        const [formattedData,table] = useFormat(unformattedData);
        console.log(formattedData,table);
        setTable(table);
        setData(formattedData);
      });
    },[path]);

    /*
      moveout = cv2.VideoWriter(move_file, fourcc, 10.0, (640,480),True)
      
      The PixelRatio API of react native might be what you are looking for.
      It has methods like getPixelSizeForLayoutSize() and roundToNearestPixel()

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
            <Text 
              style = {styles.dateText}
              onPress={()=>{setBool(false); console.log(bool);}}>
              {path.substring(0,path.lastIndexOf("/")).replaceAll("/","-")}
            </Text>}
            bool={bool}>
          </DateTitle>
          <VideoSelection videoList={
            <View style={styles.container}>{data?.map((list) => 
              <SectionList
                  sections={list}
                  keyExtractor={(item, index) => item + index}
                  renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
                  renderItem={({item}) => 
                  <TouchableHighlight
                  onPress={() => useGetSignedUrl(table.get(item)).then(data =>{
                    setUrl(data);
                    status.isPlaying ? video.current.pauseAsync() : video.current.playAsync();
                    video.current.setPositionAsync(0);
                    console.log(item,url);
                    })}> 
                      <View>
                          <Text style={styles.itemText}>{item}</Text>
                      </View>
                  </TouchableHighlight>}
                />)}
                </View>} 
                calendar = {<Calendar
                style={{backgroundColor: '#444C48',}}
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
          height: 20,
          width: "100%",
        }}
      />
    );
}

const styles = StyleSheet.create({
  main: {
    justifyContent: "space-evenly",
    height: "100%",
    width: "100%",
  },
  container: {
    flexDirection:"row",
    backgroundColor: '#444C48',
    height: "50%",
    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
    justifyContent: "space-evenly",
    borderBottomWidth: 2,
    borderTopWidth : 2,
    borderColor: "black",
  },
  list: {
    alignItems: "center",
    flexGrow:1,
    borderLeftWidth: 1,
    borderRightWidth :1,
    borderColor: "black",

  },
  dateTitle: {
    alignItems: "center",
  },
  dateText: {
    fontSize: 30,
  },
  itemText: {
    fontSize: 20,
  },
});





































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