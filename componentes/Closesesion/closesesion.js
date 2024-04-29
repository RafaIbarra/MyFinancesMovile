import React, {useEffect, useState,useLayoutEffect } from 'react';
import Handelstorage from '../../Storage/handelstorage';
import {  View,Text, } from "react-native";
import { useRoute } from "@react-navigation/native";

function CloseSesion(){
    const { params: { setActivarsesion },} = useRoute();
    const [mostrar, setMostrar]=useState(true)
    

    useLayoutEffect (() => {

        const cargardatos = async () => {
            console.log('entro en cerrar')
            await Handelstorage('borrar')
            await new Promise(resolve => setTimeout(resolve, 1000))
            setMostrar(false)
            setActivarsesion(false)
            // navigation.dispatch(DrawerActions.closeDrawer());
          
        };
        cargardatos()
        
      }, [setActivarsesion]);

    if(mostrar){

        return(
            <View >
                
                <Text> Datos de sesion caducadas, cerrando sesion </Text>
            </View>
        )
    }

}
export default CloseSesion