import React,{useState,useEffect, useContext,useRef } from "react";

import { ActivityIndicator, View,Text,SafeAreaView,
    StatusBar,StyleSheet,ImageBackground ,Animated, Easing,  } from "react-native";
import { TextInput,Button } from 'react-native-paper';

import Iniciarsesion from "../componentes/PeticionesApi/apiiniciosesion";
import Generarpeticion from "../componentes/PeticionesApi/apipeticiones";
import Handelstorage from "../Storage/handelstorage";
import ComprobarStorage from "../Storage/verificarstorage";
import { AuthContext } from "../AuthContext";

import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; // Importa el icono de spinner
function Login ({setSesionname}){
    const[username,setUsername]=useState('')
    const[password,setPassword]=useState('')
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const [mensajeusuario,setMensajeusuario]=useState('Comprobando Sesion')

    const spinValueRef = useRef(new Animated.Value(0));
    const [comprobando,setComprobando]=useState(false)
    let control=0
    const activarspin = () => {
        if (control===0){

            Animated.timing(spinValueRef.current, {
              toValue: 1,
              duration: 2000,
              easing: Easing.linear,
              useNativeDriver: true,
            }).start(() => {
                // Reinicia la animación una vez que haya terminado
                spinValueRef.current.setValue(0);
                activarspin();
              });
    
            setTimeout(() => {
                spinValueRef.current.stopAnimation();
                control=1
              }, 5000);
        }
      };
      const detenerSpin = () => {
        Animated.timing(spinValueRef.current).stop();
        
      };
      const spin = spinValueRef.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'], // Rango de rotación de 0 a 360 grados
      });
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
            setSesionname(datos['data']['user_name'])
            const datestorage=await Handelstorage('obtenerdate');
            const mes_storage=datestorage['datames']
            const anno_storage=datestorage['dataanno']
            if(mes_storage ===0 || anno_storage===0){

                await new Promise(resolve => setTimeout(resolve, 1000))

            }
            setActivarsesion(true)
            
           
        }else{
            
            
            console.log(datos['data']['error'])
        }

        
    }

    useEffect(() => {

        const cargardatos=async()=>{
            console.log('vino a login')
            
            const datosstarage = await ComprobarStorage()
            console.log(datosstarage)
            const credenciales=datosstarage['datosesion']
            if (credenciales) {
                setComprobando(true)
                activarspin()
                const body = {};
                const endpoint='ComprobarSesionUsuario/'
                const result = await Generarpeticion(endpoint, 'POST', body);
                const respuesta=result['resp']
                if (respuesta === 200){
                    
                    setSesionname(datosstarage['user_name'])
                    await new Promise(resolve => setTimeout(resolve, 7000))
                    setMensajeusuario('Credenciales validas')
                    detenerSpin()
                    await new Promise(resolve => setTimeout(resolve, 2000))
                    setComprobando(false)
                    setActivarsesion(true)

                }else{
                    await new Promise(resolve => setTimeout(resolve, 7000))
                    setMensajeusuario('Debe reiniciar sesion')
                    detenerSpin()
                    await Handelstorage('borrar')
                    setActivarsesion(false)
                    setSesionname('')
                    await new Promise(resolve => setTimeout(resolve, 2000))
                    setComprobando(false)
                    //setActivarsesion(true)
                }

            
        
            } else {
                detenerSpin()
                setComprobando(false)
                await Handelstorage('borrar')
                setActivarsesion(false)
                setSesionname('')
            }
        }
        cargardatos()
      }, []);
    
    return(
        <SafeAreaView style={{ flex: 1}}>

            
            <StatusBar />

                
                        <View style={{ flex: 1}}>
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
                        </View>

                        {
                            comprobando &&(

                            <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                                <View style={{ alignItems: 'center' }}>
                                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                    <Fontisto name="spinner" size={60} color="blue" />
                                    </Animated.View>
                                    <Text style={{color:'rgba(255,255,255,0.6)',fontSize:20 }}>{mensajeusuario}</Text>
                                </View>
                            </View>
                            )
                        }
                  
                

            
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