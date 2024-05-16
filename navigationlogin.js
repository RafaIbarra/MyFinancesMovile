import React,{useState,useContext } from "react";
import {NavigationContainer,DefaultTheme} from "@react-navigation/native";
import { useTheme } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Login from "./screens/Login";
import RegistroUsuario from "./screens/RegistroUsuario";


const MyTheme = {
    ...DefaultTheme,
      dark: true,
      colors: {
        ...DefaultTheme.colors,
        // background: 'rgba(28,44,52,0.7)',
        background: 'rgb(28,44,52)',
        backgroundInpunt: 'rgb(28,44,52)',
        textbordercoloractive:'rgb(44,148,228)',
        textbordercolorinactive:'gray',
        //background: 'red',
        text:'white',
        color:'red',
        primary:'white',
        tintcolor:'red',
        card: 'rgb(28,44,52)', //color de la barra de navegadores
        commentText:'red',
        bordercolor:'#d6d7b3',
        // iconcolor:'#cddae8cb'
        iconcolor:'white',
        
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
            component={Login}
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
                <LoginStackGroup ></LoginStackGroup>
            </NavigationContainer>
        </GestureHandlerRootView>
    )
}
export default NavigationLogin