import React,{useState,useEffect} from "react";

import { ActivityIndicator, View,Text,SafeAreaView,
    StatusBar,StyleSheet,ImageBackground  } from "react-native";
import { TextInput,Button } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Iniciarsesion from "../componentes/PeticionesApi/apiiniciosesion";
import Handelstorage from "../Storage/handelstorage";
import ComprobarStorage from "../Storage/verificarstorage";
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

    useEffect(() => {

        const cargardatos=async()=>{
           const datosstarage = await ComprobarStorage()
           const credenciales=datosstarage['datosesion']
           if (credenciales) {
            setActivarsesion(true)
          
        
        } else {
            setActivarsesion(false)
        }
        }
        cargardatos()
      }, []);
    
    return(
        <SafeAreaView style={{ flex: 1}}>
            <StatusBar />
            

                <ImageBackground
                    source={require('../assets/ahorro6.png')} // Ruta de la imagen de fondo
                    style={styles.imagenFondo}
                    resizeMode='contain'
                    >
                    <View style={styles.contenedorelementos} >

                        <View style={styles.elemento}>
                            <TextInput 

                                backgroundColor='rgba(182, 212, 212,0.5)'
                                label="Usuario" 
                                value={username} 
                                onChangeText={username => setUsername(username)}
                                />
                        </View>

                        <View style={styles.elemento}>
                            <TextInput 
                            label="Password" 
                            secureTextEntry 
                            value={password} 
                            backgroundColor='rgba(182, 212, 212,0.5)'
                            onChangeText={password => setPassword(password)}/>
                        </View>

                        <View style={styles.elemento}>
                            <Button icon="account-check-outline" mode="contained" onPress={() => ingresar()}>
                                INGRESAR
                            </Button>
                        </View>
                    </View>
                </ImageBackground>
            
         </SafeAreaView>

         

        
    )
}
const styles = StyleSheet.create({
    contenedorprincipal:{
        width: 300, // Ancho fijo del contenedor
         height: 200
    }
    ,
    imagenFondo: {
        flex: 1,
        justifyContent: 'center', // Alinear la imagen en el centro
        backgroundColor:'rgb(182, 212, 212)',
        width: '100%',
        height: '100%',
        
      },
    contenedorelementos:{
        flex: 1,
        justifyContent: 'flex-end', // Alinear los elementos en la parte inferior
        padding: 10,
        width:'95%',
        marginLeft:10
    },
    elemento: {
        marginBottom: 5, // Espacio entre elementos
        
      },

    
    
    }
  );
export default Login