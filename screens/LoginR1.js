import React, {useState,useEffect, useContext,useRef} from "react";
import { View, Text, StyleSheet,Image,FlatList, Linking, TouchableOpacity,Animated,Easing,Keyboard } from "react-native";
import { Button, TextInput,Dialog, Portal,PaperProvider } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

import Handelstorage from "../Storage/handelstorage";
import ComprobarStorage from "../Storage/verificarstorage";
import Iniciarsesion from "../componentes/PeticionesApi/apiiniciosesion";
import Comprobarsesion from "../componentes/PeticionesApi/apicomprobarsesion";
import Procesando from "../componentes/Procesando/Procesando";
import { AuthContext } from "../AuthContext";
import { Fontisto } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
// import '../assets/a'
export default function LoginR1({ navigation  }){
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { navigate } = useNavigation();
  const { activarsesion, setActivarsesion } = useContext(AuthContext);
  const { versionsys,setVersionsys } = useContext(AuthContext);
  const { colors } = useTheme();
  const [username, setUsername] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [botonActivado, setBotonActivado] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  
  const {periodo, setPeriodo} = useContext(AuthContext);
  const {sesiondata, setSesiondata} = useContext(AuthContext);

  const [mensajeusuario,setMensajeusuario]=useState('Comprobando Sesion')
  const [comprobando,setComprobando]=useState(false)

  const [guardando,setGuardando]=useState(false)
  const [visibledialogo, setVisibledialogo] = useState(false)
  const[mensajeerror,setMensajeerror]=useState('')
  const [errorred,setErrorred]=useState(false)

  const showDialog = () => setVisibledialogo(true);
  const hideDialog = () => setVisibledialogo(false);

  const spinValueRef = useRef(new Animated.Value(0));

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
   
 
  const handleUserChange = (text) => {
    setUsername(text.trim());
    checkActivacionBoton(text, contrasena);
  };

  const handleContrasenaChange = (text) => {
    setContrasena(text);
     checkActivacionBoton(username, text);
  };

  const checkActivacionBoton = (doc, pass) => {
    if (doc !== '' && pass !== '') {
      setBotonActivado(true);
    } else {
      setBotonActivado(false);
    }
  };

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const ingresar= async ()=>{
        
    setGuardando(true)
    const datos =await Iniciarsesion(username, contrasena)

    if(datos['resp']===200){
        
        // await AsyncStorage.setItem("user", (JSON.stringify(datos['data']['token'])));
        
        
        const userdata={
            token:datos['data']['token'],
            sesion:datos['data']['sesion'],
            refresh:datos['data']['refresh'],
            user_name:datos['data']['user_name'],
        }
        await Handelstorage('agregar',userdata,'')
        // setSesionname(datos['data']['user_name'])
        const datestorage=await Handelstorage('obtenerdate');
        const mes_storage=datestorage['datames']
        const anno_storage=datestorage['dataanno']
        
        setPeriodo(datestorage['dataperiodo'])
        if(mes_storage ===0 || anno_storage===0){

            await new Promise(resolve => setTimeout(resolve, 1500))
            
            const datestorage2=await Handelstorage('obtenerdate');
            
            setPeriodo(datestorage2['dataperiodo'])

        }
        setGuardando(false)
        setSesiondata(datos['data']['datauser'])
        
        setActivarsesion(true)
        
       
    }else{
      
      setGuardando(false)

      showDialog(true)
      setMensajeerror( datos['data']['error'])
        
    }

    
  }

  const registrarse=()=>{
    navigate("RegistroUsuarioStack")
  }

  const cargardatos=async()=>{
        
    setErrorred(false)
    setMensajeusuario('Comprobando Sesion')
    const datosstarage = await ComprobarStorage()
    
    const credenciales=datosstarage['datosesion']
    if (credenciales) {
        setComprobando(true)
        activarspin()
        
          const body = {};
          const endpoint='ComprobarSesionUsuario/'
          const result = await Comprobarsesion(endpoint, 'POST', body);
          const respuesta=result['resp']
          
          if (respuesta === 200){
              
              // setSesionname(datosstarage['user_name'])
              const datestorage=await Handelstorage('obtenerdate');
              setPeriodo(datestorage['dataperiodo'])
              
              setSesiondata(result['data']['datauser'])

              await new Promise(resolve => setTimeout(resolve, 7000))
              setMensajeusuario('Credenciales validas')
              detenerSpin()
              await new Promise(resolve => setTimeout(resolve, 2000))
              setComprobando(false)
              setActivarsesion(true)
              
          }else if (respuesta === 6000){
            setErrorred(true)
            setMensajeusuario('Conexion con el servidor')
              //setActivarsesion(true)
          } else {
              await new Promise(resolve => setTimeout(resolve, 7000))
              setMensajeusuario('Debes reiniciar sesion')
              detenerSpin()
              await Handelstorage('borrar')
              setActivarsesion(false)
              // setSesionname('')
              await new Promise(resolve => setTimeout(resolve, 2000))
              setComprobando(false)
          }
        

    

    } else {
        detenerSpin()
        setComprobando(false)
        await Handelstorage('borrar')
        setActivarsesion(false)
        // setSesionname('')
    }
}



  useEffect(() => {

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Ocultar el botón cuando el teclado se muestra
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Mostrar el botón cuando el teclado se oculta
      }
    );

    
    cargardatos()
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
      
  
  return (
    
      <PaperProvider>

        <View style={styles.containerPrincipal}>
            {guardando &&(<Procesando></Procesando>)}
            <Portal>

                  <Dialog visible={visibledialogo} onDismiss={hideDialog}>
                      <Dialog.Icon icon="alert-circle" size={50} color="red"/>
                      <Dialog.Title>ERROR</Dialog.Title>
                      <Dialog.Content>
                          <Text variant="bodyMedium">{mensajeerror}</Text>
                          
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={hideDialog}>OK</Button>
                          
                      </Dialog.Actions>
                  </Dialog>
                </Portal>
            <View>
             <Image source={require('../assets/ahorro6.png')}  style={styles.image}/>                         
             </View>
             <Text style={styles.welcomeText}>¡Bienvenido!</Text>

             <View style={styles.containerSecundario}>                    
             <TextInput
                  style={styles.Input}
                  mode="outlined"
                  textColor="white"
                  label="Usuario"
                   placeholder="Usuario"
                    onChangeText={handleUserChange} 
                    theme={{ colors: { primary: 'rgb(218, 165, 33)' },color:'white' }}
                />
                 <TextInput
                  mode="outlined"
                  textColor="white"
                  label="Ingrese la Contraseña"
                  placeholder="Contraseña"
                  style={styles.Input} 
                  value={contrasena}
                  onChangeText={handleContrasenaChange}
                  theme={{ colors: { primary: 'rgb(218, 165, 33)' } }}
                  secureTextEntry={!mostrarContrasena}
                  right={
                    <TextInput.Icon
                      icon={mostrarContrasena ? 'eye-off' : 'eye'}
                      color={'white'}
                       onPress={toggleMostrarContrasena}
                    />}

                />
                {/* <Text style={styles.TextContra}>Olvidé mi contraseña</Text> */}

              {
                !isKeyboardVisible && (

                  <Button  
                    style={[styles.button, botonActivado ? [styles.buttonActivado] : null]}
                    disabled={!botonActivado}
                    onPress={() => ingresar()}
                    >                                
                    <Text style={[styles.buttonText, botonActivado ? [styles.buttonActivadoText] : null]}>INGRESAR</Text>
                  </Button>
                )
              }

              <Text style={styles.textPulsa}>
              ¿No tienes una cuenta?{' '}
              <TouchableOpacity onPress={() => registrarse()}>
                <Text style={styles.linkText}>Regístrate aquí.</Text>
              </TouchableOpacity>
              </Text>
              <Text style={{color: colors.text,fontSize:12,marginTop:7}}> {versionsys} </Text>
              
            </View> 

            {
                comprobando &&(

                <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
                    <View style={{ alignItems: 'center'}}>
                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <Fontisto name="spinner" size={60} color="blue" />
                        </Animated.View>
                        <Text style={
                            {
                              // color:'rgba(255,255,255,0.6)',
                              color:'rgb(218,165,32)',
                              fontSize:25 }
                              }>
                          {mensajeusuario}</Text>
                        
                    </View>
                    {errorred &&(
                           <Button  
                           style={[styles.button, [styles.buttonActivado],{height:50,marginTop:100} ]}
                           
                           onPress={() => cargardatos()}
                           >                                
                           <Text style={[styles.buttonText, [styles.buttonActivadoText]]}>REINTENTAR</Text>
                         </Button>
                        )}
                </View>
                )
            }
              
        </View>
      </PaperProvider>
    )
};

const styles = StyleSheet.create({
 containerPrincipal: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    borderColor: 'white', 
    backgroundColor: 'rgb(28,44,52)',
    justifyContent: 'center',

  },
  containerSecundario: {
    width: "98%",
    height: "40%",
    marginTop:40,
    alignItems: "center",
    borderRadius:50,
    borderColor: 'white',
    borderWidth: 2,
    color:'white',
   // backgroundColor: 'rgb(206, 207, 219)',
  },
  Input:{
    borderColor: 'white',
    width: '80%',
    paddingStart: 10,
    marginTop: 20,
    backgroundColor: 'black',
    color:'white'
    
    },
  image: {
    width:200,
    height:200,
    marginTop:10,
  },
  textPulsa: {
    color: 'white',
    textAlign: 'center',
    width: 300,
    marginTop: 90,
  },
  button:{
    width:'80%',
    height: '18%',
    backgroundColor: '#e3e7e3',
    justifyContent: 'center',
    marginTop: 30,
    margin:5,
   },
   buttonText:{
    alignItems: "center",
    fontSize:18,
    color:"gray",
   },
  TextContra:{
    color: 'blue',
    marginLeft:150,
    marginTop:5,    
  },
  buttonActivado: {
    // backgroundColor: '#8fbc8f',
    backgroundColor:'rgba(44,148,228,0.7)',
    width:'80%',
    height: '18%',
    justifyContent: 'center',
    marginTop: 30,   
    margin:5, 
  },
  buttonActivadoText: { 
    alignItems: "center",
    fontSize:18, 
    color:'white',       
  },
  containerExtra: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 90,
    marginLeft:15,
  },
  item: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  separator: {
    height: '100%',
    backgroundColor: 'gray',
  },
  linkText: {
    color: 'rgba(218,165,32,0.7)',
    textDecorationLine: 'underline',
    top: 5,
  },
  welcomeText: {
    fontSize: 24,
    color: 'rgba(218,165,32,0.7)',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    top:40,
    },
});