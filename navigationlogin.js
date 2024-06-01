import React from "react";
import {NavigationContainer,DefaultTheme,DarkTheme as NavigationDarkTheme} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import LoginR1 from "./screens/LoginR1";
import RegistroUsuario from "./screens/RegistroUsuario";


const MyTheme = {
    ...NavigationDarkTheme,
      
      colors: {
        ...NavigationDarkTheme.colors,
        background: 'rgb(28,44,52)',
        backgroundInpunt: 'rgb(28,44,52)',
        textbordercoloractive:'rgb(44,148,228)',
        textbordercolorinactive:'gray',
        text:'white',
        color:'red',
        primary:'white',
        tintcolor:'red',
        card: 'rgb(28,44,52)', //color de la barra de navegadores
        commentText:'red',
        bordercolor:'#d6d7b3',
        iconcolor:'white',
        botoncolor:'rgb(44,148,228)',
        subtitulo:'rgba(32,93,93,255)'
        
      },
      
  };
const LoginStack=createNativeStackNavigator();
function LoginStackGroup(){
    return(
        <LoginStack.Navigator
        screenOptions={{headerShown:false}}
        >
            <LoginStack.Screen
            name="LoginStack"
            component={LoginR1}
            />
            <LoginStack.Screen
            name="RegistroUsuarioStack"
            component={RegistroUsuario}
            />
        </LoginStack.Navigator>
    )
}
function NavigationLogin(){
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer theme={MyTheme }>
            <StatusBar backgroundColor='rgb(28,44,52)'  />
                <LoginStackGroup ></LoginStackGroup>
            </NavigationContainer>
        </GestureHandlerRootView>
    )
}
export default NavigationLogin