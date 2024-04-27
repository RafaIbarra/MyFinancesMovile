
import React,{useState,useEffect} from "react";
import "react-native-gesture-handler";
import Navigation from "./Navigation";
import { ActivityIndicator, View,SafeAreaView,StyleSheet,useColorScheme,   } from "react-native";
import Login from "./screens/Login";
import Resumen from "./componentes/Resumen/Resumen";

import Navigationv2 from "./Nivagationsv2";

export default function App() {
  const [activarsesion,setActivarsesion]=useState(false)
  const [sesionname,setSesionname]=useState('')
  
  
    return (

      <SafeAreaView style={styles.container} >
        

        <View style={styles.container} >
          
        
          
          {/* { activarsesion ? <Navigation setActivarsesion={setActivarsesion} sesionname={sesionname}></Navigation>: <Login setActivarsesion={setActivarsesion} setSesionname={setSesionname}></Login>} */}
          { activarsesion ? <Navigationv2 setActivarsesion={setActivarsesion} sesionname={sesionname}></Navigationv2>: <Login setActivarsesion={setActivarsesion} setSesionname={setSesionname}></Login>}
          {/* { activarsesion ? <Navigation setActivarsesion={setActivarsesion} sesionname={sesionname}></Navigation>: <Resumen ></Resumen>} */}
        </View>
        
      </SafeAreaView>
    );
  
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text:{
    color:'red'
  }
});