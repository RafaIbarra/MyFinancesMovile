
import React,{useState,useEffect} from "react";
import "react-native-gesture-handler";
import Navigation from "./Navigation";
import { ActivityIndicator, View,SafeAreaView } from "react-native";
import Login from "./screens/Login";
import Home from "./screens/Home";

export default function App() {
  const [activarsesion,setActivarsesion]=useState(false)
  
    return (

      <SafeAreaView style={{ flex: 1}}>
        
        <View style={{ flex: 1}}>
          
          {/* <Navigation></Navigation> */}
          
          { activarsesion ? <Navigation setActivarsesion={setActivarsesion}></Navigation>: <Login setActivarsesion={setActivarsesion}></Login>}
        </View>
      </SafeAreaView>
    );
  
  
}

