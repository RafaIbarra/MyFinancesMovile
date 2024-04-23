import React, {useEffect, useState} from 'react';
import Handelstorage from '../../Storage/handelstorage';



import { ActivityIndicator, View,Text,SafeAreaView,
    StatusBar,StyleSheet,ImageBackground  } from "react-native";

function CloseSesion({setActivarsesion}){
    
    const [mostrar, setMostrar]=useState(true)

    useEffect(() => {

        
        
        
        const cargardatos = async () => {
            await Handelstorage('borrar')
            await new Promise(resolve => setTimeout(resolve, 1000))
            setMostrar(false)
            setActivarsesion(false)
          
        };
        cargardatos()
        
      }, []);

    if(mostrar){

        return(
            <View >
                
                <Text> Datos de sesion caducadas, cerrando sesion </Text>
            </View>
        )
    }

}
export default CloseSesion