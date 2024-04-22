import React,{useState,useEffect} from "react";

import { ActivityIndicator, View,Text,SafeAreaView } from "react-native";
import { TextInput,Button } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Iniciarsesion from "../componentes/PeticionesApi/apiiniciosesion";
import Handelstorage from "../Storage/handelstorage";
function Login ({setActivarsesion}){
    const[username,setUsername]=useState('')
    const[password,setPassword]=useState('')

    const ingresar= async ()=>{
        

        const datos =await Iniciarsesion(username, password)

        if(datos['resp']===200){
            
            // await AsyncStorage.setItem("user", (JSON.stringify(datos['data']['token'])));
            const userdata={
                token:datos['data']['token'],
                sesion:datos['data']['sesion'],
                refresh:datos['data']['refresh'],
                user_name:datos['data']['user_name'],
            }
            await Handelstorage('agregar',userdata,'')

            setActivarsesion(true)
            
           
        }else{
            
            
            console.log(datos['data']['error'])
        }

        
    }
    
    return(
        <SafeAreaView style={{ flex: 1}}>

            <View  style={{ flex: 1,backgroundColor:"red" }}>
                                <Text> LOGIN </Text>
                    <TextInput
                        label="Usuario"
                        value={username}
                        onChangeText={username => setUsername(username)}
                        />
                    

                    <TextInput
                        label="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={password => setPassword(password)}
                        right={<TextInput.Icon icon="eye" />}
                        />

                    <Button icon="camera" mode="contained" onPress={() => ingresar()}>
                        INGRESAR
                    </Button>


                    
                    
                
            </View>
         </SafeAreaView>

         

        
    )
}

export default Login