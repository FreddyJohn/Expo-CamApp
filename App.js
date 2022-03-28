import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native-web';
import { 
  StyleSheet,
  SafeAreaView, 
  View, 
} from "react-native";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import {Calendar
  , CalendarList
  , Agenda} from 'react-native-calendars';
import {ListVideo} from './components/ListVideo'

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
       
      <ListVideo/>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flexDirection:"column",
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
    justifyContent: "space-evenly",
  },
  video : {
    height: "60%",
    width: "100%"
  },
  uploadList: {
    flexDirection: 'row',
    height: "30%",
    justifyContent:"space-evenly"
  },
  timeTitle:{
    alignItems: "center",
    justifyContent: "center",
  },
  textItem:{
    fontSize:17,
    marginBottom:7,
  },
  timeofDayTitle:{
    fontSize:17,
    marginBottom: 20,
  }
});


