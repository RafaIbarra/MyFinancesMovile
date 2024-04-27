
import React,{useState,useEffect} from "react";
import "react-native-gesture-handler";
import Navigation from "./Navigation";
import { ActivityIndicator, View,SafeAreaView,StyleSheet  } from "react-native";
import Login from "./screens/Login";
import Resumen from "./componentes/Resumen/Resumen";
import * as SystemUI from 'expo-system-ui';


export default function App() {
  const [activarsesion,setActivarsesion]=useState(false)
  const [sesionname,setSesionname]=useState('')
  SystemUI.setBackgroundColorAsync("black");
  
    return (

      <SafeAreaView style={styles.container}>
        

        <View style={{ flex: 1}}>
          
        
          
          { activarsesion ? <Navigation setActivarsesion={setActivarsesion} sesionname={sesionname}></Navigation>: <Login setActivarsesion={setActivarsesion} setSesionname={setSesionname}></Login>}
          {/* { activarsesion ? <Navigation setActivarsesion={setActivarsesion} sesionname={sesionname}></Navigation>: <Resumen ></Resumen>} */}
        </View>
        
      </SafeAreaView>
    );
  
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'rgb(28,44,52)' // Color por defecto para todas las pantallas
  }
});