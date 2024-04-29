import React,{useState,useEffect } from "react";
import { ActivityIndicator, View,Text,StyleSheet  } from "react-native";
import {DefaultTheme, Provider} from 'react-native-paper';
import { useTheme } from '@react-navigation/native';




function Resumen (){
  const { colors } = useTheme();
    return(
        

        <View style={styles.container} >
            <Text style={{ color: colors.text }}> Resumen del mes aca prueba colores Anita</Text>
            
        </View>
        
    )



}
const styles = StyleSheet.create({
    container: {
      flex: 1
    },
   
  });


export default Resumen