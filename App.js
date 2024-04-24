
import React,{useState,useEffect} from "react";
import "react-native-gesture-handler";
import Navigation from "./Navigation";
import { ActivityIndicator, View,SafeAreaView } from "react-native";
import Login from "./screens/Login";
import Home from "./screens/Home";

export default function App() {
  const [activarsesion,setActivarsesion]=useState(false)
  const [sesionname,setSesionname]=useState('')
  
    return (

      <SafeAreaView style={{ flex: 1}}>
        
        <View style={{ flex: 1}}>
          
          {/* <Navigation></Navigation> */}
          
          { activarsesion ? <Navigation setActivarsesion={setActivarsesion} sesionname={sesionname}></Navigation>: <Login setActivarsesion={setActivarsesion} setSesionname={setSesionname}></Login>}
        </View>
      </SafeAreaView>
    );
  
  
}

