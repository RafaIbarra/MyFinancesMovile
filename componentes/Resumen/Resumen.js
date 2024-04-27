import React,{useState,useEffect } from "react";
import { ActivityIndicator, View,Text,StyleSheet  } from "react-native";
import {DefaultTheme, Provider} from 'react-native-paper';





function Resumen (){
    
    return(
        

        <View style={styles.container} >
            <Text > Resumen del mes aca prueba colores Anita</Text>
            
        </View>
        
    )



}
const styles = StyleSheet.create({
    container: {
      flex: 1
    },
   
  });


export default Resumen