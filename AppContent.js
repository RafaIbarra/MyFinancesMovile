import React,{useState,useEffect,useContext} from "react";
import Navigation from "./Navigation"; 
import NavigationLogin from "./navigationlogin";
import { ActivityIndicator, View,SafeAreaView,StyleSheet } from "react-native";
import Login from "./screens/Login";
import { AuthContext } from "./AuthContext";

function AppContent() {
    const { activarsesion, setActivarsesion } = useContext(AuthContext);

    const [sesionname, setSesionname] = useState("");

    useEffect(() => {

        const cargardatos=()=>{
            
            
           
        }
        cargardatos()
      }, [activarsesion]);
  
    return (
      // <SafeAreaView style={styles.container}>
        
        
      // </SafeAreaView>
      // <View style={styles.container}>{activarsesion ? (<Navigation sesionname={sesionname} />) : (<Login setSesionname={setSesionname} />)}</View>
      <View style={styles.container}>{activarsesion ? (<Navigation sesionname={sesionname} />) : (<NavigationLogin  />)}</View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    text: {
      color: "red",
    },
  });


  export default AppContent