import React,{useState,useEffect} from "react";
import {NavigationContainer,DefaultTheme,DarkTheme,MD3LightTheme } from "@react-navigation/native";
import { useColorScheme } from 'react-native';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ActivityIndicator, View,Text,StyleSheet  } from "react-native";

import Resumen from "./componentes/Resumen/Resumen";
import ConceptosGastos from "./componentes/ConceptosGastos/ConceptosGastos";

const MyTheme2 = {
    ...DefaultTheme,
    dark: true,
    colors: {
      ...DefaultTheme.colors,
      background: 'rgba(28,44,52,0.7)',
      text:'white',
      color:'red',
      primary:'white',
      tintcolor:'red',
      card: 'rgba(28,44,52,0.2)', //color de la barra de navegadores
      commentText:'red'
    },
    
  };



const DrawerNew = createDrawerNavigator();
function DrawerNewoptions({setActivarsesion,sesionname}) {
    return (
      <DrawerNew.Navigator >
        <DrawerNew.Screen name="HomeResumen" component={Resumen} />
        <DrawerNew.Screen name="ConceptosGastos" component={ConceptosGastos} />
      

    </DrawerNew.Navigator>
    );
  }

function Navigationv2( {setActivarsesion,sesionname}){
    
    return(
        <NavigationContainer theme={MyTheme2 }>
                

                <DrawerNewoptions setActivarsesion={setActivarsesion} sesionname={sesionname} />
                
        
            </NavigationContainer>
        
    )
    }

export default Navigationv2