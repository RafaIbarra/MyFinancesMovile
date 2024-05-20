import React,{useEffect,useContext} from "react";
import Navigation from "./Navigation"; 
import NavigationLogin from "./navigationlogin";
import {  View,StyleSheet } from "react-native";
import { AuthContext } from "./AuthContext";

function AppContent() {
    const { activarsesion, setActivarsesion } = useContext(AuthContext);

    useEffect(() => {

        const cargardatos=()=>{
     
        }
        cargardatos()
      }, [activarsesion]);
  
    return (
    
      <View style={styles.container}>{activarsesion ? (<Navigation/>) : (<NavigationLogin  />)}</View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    
  });


  export default AppContent