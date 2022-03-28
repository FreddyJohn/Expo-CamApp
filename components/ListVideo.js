import React, {useEffect,useState} from 'react';
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from 'react-native';
import useGetSignedUrl from '../s3/GetSignedUrl';
import useDailyUploadsList from '../s3/GetObjectList';
import {Video} from 'expo-av';

//functional component
export const ListVideo = () => {
    const [status,setStatus] = React.useState([]);
    const [url,setUrl] = React.useState([]);

    const data = useDailyUploadsList();
    useEffect(()=>{
    },[data])
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
          <View style={styles.container}>
                      {data.lists?.map((list)=> 
                  <FlatList
                      ItemSeparatorComponent={ItemDivider}
                      ListHeaderComponent={()=><Text>{"tod"}</Text>}
                      data={list}
                      renderItem={({item}) => (
                      <TouchableHighlight 
                      onPress={() => useGetSignedUrl(item.value).then(data =>{
                        setUrl(data);
                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync();
                        console.log(item,url) 
                        })}> 
                          <View>
                              <Text>{item.key}</Text>
                          </View>
                      </TouchableHighlight>)}
              />)}
          </View>
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
    },});











/*
            {data.list.map(list => 
            <FlatList
              data={list}
              renderItem={({data}) => (
              <TouchableHighlight 
                onPress={() => console.log(data.key)}> 
                <View>
                  <Text style={styles.textItem}>{item.key}</Text>
                </View>
              </TouchableHighlight>)}/>)}
*/
/*
<View style={styles.timeTitle}>
    <Text style={styles.timeofDayTitle}>{"AM"}</Text>
    <FlatList 
    data={AMList}
    ItemSeparatorComponent={ItemDivider}
    renderItem={({item}) => (
        <TouchableHighlight 
        onPress={() => getUrl(item.value).then(url => {
            console.log(url);
            setUrl(url);
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync();
        }).catch(getUrl(console.error))}> 
        <View>
            <Text style={styles.textItem}>{item.key}</Text>
        </View>
        </TouchableHighlight>)}/>
</View>
*/


























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