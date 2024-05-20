import React,{useState,useEffect,useContext} from "react";
import { ActivityIndicator, View,Text,StyleSheet,TextInput } from "react-native";
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps'
import { Button, Dialog, Portal,PaperProvider } from 'react-native-paper';
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import { AuthContext } from "../../AuthContext";
import { useTheme } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
function Seguridad({ navigation  }){
    const [paso,setPaso]=useState(0)
    const [completado,setCompletado]=useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [correouser,setCorreouser]=useState('')
    const [cargacompleta,setCargacopleta]=useState(false)
    const [isFocusedcodigo, setIsFocusedcodigo] = useState(false)
    const [focuscodigo, setFocuscodigo] = useState(false)
    const [codigoseguridad,setCodigosegurirad]=useState('')

    const [pass1,setPass1]=useState('')
    const [isFocusedpass1, setIsFocusedpass1] = useState(false)
    const [focuspass1, setFocuspass1] = useState(false)


    const [pass2,setPass2]=useState('')
    const [isFocusedpass2, setIsFocusedpass2] = useState(false)
    const [focuspass2, setFocuspass2] = useState(false)

    const [readycorreo,setReadycorreo]=useState(false)

    const [readycomprobar,setReadycomprobar]=useState(false)
    const [error,setError]=useState(false)
    const [mensajeinfo,setMensajeinfo]=useState('')


    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { colors } = useTheme();

    const [visibledialogo, setVisibledialogo] = useState(false)

    const showDialog = () => setVisibledialogo(true);
    // const hideDialog = () => setVisibledialogo(false);
    const hideDialog =()=>{

        setVisibledialogo(false);
        if (paso===3){
            setPaso(0)
            navigation.goBack()
        }
    }



    const buttonTextStyle = {
        color: 'white',
        borderWidth:1,
        borderRadius:20,
        textAlign: 'center',
        backgroundColor:'rgba(44,148,228,0.7)',
        height:40,
        // width:200,
        padding: 8
        
        
        
        
    };
    const textocodigo=(valor)=>{
        setCodigosegurirad(valor)
        if (!focuscodigo && valor !== '') {
            setFocuscodigo(true);
        } else if (focuscodigo && valor === '') {
            setFocuscodigo(false);
        }
      }

    const textopass1=(valor)=>{
        setPass1(valor)
        if (!focuspass1 && valor !== '') {
            setFocuspass1(true);
        } else if (focuspass1 && valor === '') {
            setFocuspass1(false);
        }
      }

    const textopass2=(valor)=>{
        setPass2(valor)
        if (!focuspass2 && valor !== '') {
            setFocuspass2(true);
        } else if (focuspass2 && valor === '') {
            setFocuspass2(false);
        }
      }

   const enviocorreo= async()=>{
        setCodigosegurirad('0')
        setIsLoading(true)
        const datosregistrar = {};
        const endpoint='EnvioCorreoPassword/'
        const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
        
        const respuesta=result['resp']
        if (respuesta === 200) {
            setReadycorreo(true)
            // setPaso(1)
        
        } else if(respuesta === 403 || respuesta === 401){
            setReadycorreo(false)
            await Handelstorage('borrar')
            await new Promise(resolve => setTimeout(resolve, 1000))
            setActivarsesion(false)

        }else {
            
            setReadycorreo(false)
            setMensajeinfo(result['data']['error'])
            setError(true)
            showDialog(true)
        }
        setIsLoading(false)
        
   }

   const comprobar= async()=>{
    setIsLoading(true)
    if (codigoseguridad>0) {
        const datosregistrar = {
            codigo:codigoseguridad
        
          };
          const endpoint='ComprobarCodigo/'
          const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
          
          const respuesta=result['resp']
          if (respuesta === 200) {
            setReadycomprobar(true)
            setPaso(2)
            
          } else if(respuesta === 403 || respuesta === 401){
            
            await Handelstorage('borrar')
            await new Promise(resolve => setTimeout(resolve, 1000))
            setActivarsesion(false)
        
          }else{
            setError(true)
            setReadycomprobar(false)
            
            setMensajeinfo(result['data']['error'])
            showDialog(true)
          }

    }else{
        setError(true)
        setMensajeerror('No se ingreso ningun codigo de seguridad')
        showDialog(true)
    }
    setIsLoading(false)
    
   }

   const cambio= async()=>{
    
        setIsLoading(true)
        const datosregistrar = {
            codigo:codigoseguridad,
            password:pass1,
            password2:pass2
        
        };
        const endpoint='ActualizarPassword/'
        const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
        
        const respuesta=result['resp']
        if (respuesta === 200) {
            setPass1('')
            setPass2('')
            setCodigosegurirad('0')
            setMensajeinfo(result['data']['mensaje'])
            setPaso(3)
            setError(false)
            showDialog(true)
            setCompletado(true)
            // await new Promise(resolve => setTimeout(resolve, 2000))
            // navigation.goBack();
            
            
        } else if(respuesta === 403 || respuesta === 401){
            
            await Handelstorage('borrar')
            await new Promise(resolve => setTimeout(resolve, 1000))
            setActivarsesion(false)
        
        }else{
            
            setMensajeinfo(result['data']['error'])
            setError(true)
            showDialog(true)
        }
        setIsLoading(false)



   }

   useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
   
        const cargardatos=async()=>{
            const body = {};
            const endpoint='ObtenerDatosUsuario/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            
            const respuesta=result['resp']
            
            if (respuesta === 200) {

                const registros=result['data']
                
                
                setCorreouser(result['data'][0].correo)
                
                
            }else if(respuesta === 403 || respuesta === 401){
                
                
                await Handelstorage('borrar')
                await new Promise(resolve => setTimeout(resolve, 1000))
                setActivarsesion(false)
            }
            
            setCargacopleta(true)

           
        }
        cargardatos()
    
    
    })
    return unsubscribe;
    
  }, [navigation]);

    if(cargacompleta){

        return(
            <PaperProvider >

                <View style={{flex: 1}}>
                    <View style={styles.loadingOverlay}>
                        {isLoading && (
                        <ActivityIndicator size="large" color="#0000ff" />
                        )}
                    </View>
                    <View style={styles.cabeceracontainer}>

                        
                            
                        
                       <Text style={[styles.titulocabecera, { color: colors.text}]}>Cambio Contraseña</Text>

                       
                    </View>
                    

                    <Portal>

                        <Dialog visible={visibledialogo} onDismiss={hideDialog}>

                            {error ?(<Dialog.Icon icon="alert-circle" size={50} color="red"/>): (<Dialog.Icon icon="information-outline" size={50} color="blue"/>)}

                            {error ?(<Dialog.Title>ERROR</Dialog.Title>) :(<Dialog.Title>CORRECTO!</Dialog.Title>)}

                            <Dialog.Content>
                                <Text variant="bodyMedium">{mensajeinfo}</Text>
                                
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideDialog}>OK</Button>
                                
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <ProgressSteps
                        progressBarColor='gray'
                        labelColor={colors.text}
                        activeStepNumColor={colors.text}
                        disabledStepNumColor='black'
                        marginBottom={50}
                        activeStep={paso}
                        
                    
                    // activeLabelColor='red'
                    >
                        <ProgressStep label="Envio Correo" 
                                    nextBtnTextStyle={buttonTextStyle} 
                                    nextBtnText='Enviar Correo >>'
                                    
                                    onNext={enviocorreo}
                                    >
                            <View style={{ alignItems: 'center',borderWidth:1,borderColor:  colors.bordercolor,height:150,padding:10,
                                        alignContent:'center',alignItems:'center',justifyContent:'space-between'}}>
                                <Text style={{color: colors.text}}>Se enviara un correo a 
                                    <Text style={{fontWeight:'bold',fontStyle:'italic'}}>  {correouser}  </Text>
                                    con el Codigo de seguridad </Text>

                                <Text style={{color: colors.text}}>El codigo de seguridad tendra una validez de 15 minutos desde su envio </Text>
                            </View>
                        </ProgressStep>


                        <ProgressStep label="Comprobar Codigo" 
                                        nextBtnTextStyle={buttonTextStyle} 
                                        previousBtnTextStyle={buttonTextStyle}
                                        nextBtnText='Comprobar >>' 
                                        previousBtnText='<< Anterior'
                                        onNext={comprobar}
                                        >
                            <View style={{ alignItems: 'center',borderWidth:1,borderColor:  colors.bordercolor,height:150,padding:10,
                                        alignContent:'center',alignItems:'center',justifyContent:'space-between'}}>
                                {
                                    readycorreo ?(
                                        <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, 
                                            borderBottomColor: isFocusedcodigo ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                            placeholder='Ingrese Codigo Seguridad'
                                            placeholderTextColor='gray'
                                            //label='Obserbacion'
                                            value={codigoseguridad}
                                            // textAlignVertical="center"
                                            onChangeText={codigoseguridad => textocodigo(codigoseguridad)}
                                            onFocus={() => setIsFocusedcodigo(true)}
                                            onBlur={() => setIsFocusedcodigo(false)}
                                            underlineColorAndroid="transparent"
                            />
                                    ): (
                                        <View style={{alignContent:'center',alignItems:'center'}}> 
                                          <Ionicons  name="warning" size={50} color="yellow" />
                                          <Text style={{
                                                        // color:'rgba(255,115,96,0.5)',
                                                        color:'rgba(255,255,255,0.6)',
                                                        fontSize:20}}> Se ha producido un error, vuelve al paso anterior </Text>
                                        </View>
                                    )
                                }
                                
                            </View>
                        </ProgressStep>


                        <ProgressStep label="Cambiar Contraseña" 
                                    nextBtnTextStyle={buttonTextStyle} 
                                    previousBtnTextStyle={buttonTextStyle}
                                    finishBtnText='Procesar >>' 
                                        previousBtnText='<< Anterior'
                                    onSubmit={cambio}
                                    >
                            <View style={{ alignItems: 'center',borderWidth:1,borderColor:  colors.bordercolor,height:200,padding:10,
                                        alignContent:'center',alignItems:'center',justifyContent:'space-between'}}>

                                {
                                    readycomprobar ?(
                                        <View> 

                                            <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, 
                                                                borderBottomColor: isFocusedpass1 ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                                                placeholder='Ingrese contraseña'
                                                                placeholderTextColor='gray'
                                                                //label='Obserbacion'
                                                                value={pass1}
                                                                // textAlignVertical="center"
                                                                onChangeText={pass1 => textopass1(pass1)}
                                                                onFocus={() => setIsFocusedpass1(true)}
                                                                onBlur={() => setIsFocusedpass1(false)}
                                                                underlineColorAndroid="transparent"
                                                                secureTextEntry={true}
                                                />
            
                                            <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, 
                                                                borderBottomColor: isFocusedpass2 ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                                                placeholder='Repita contraseña'
                                                                placeholderTextColor='gray'
                                                                //label='Obserbacion'
                                                                value={pass2}
                                                                // textAlignVertical="center"
                                                                onChangeText={pass2 => textopass2(pass2)}
                                                                onFocus={() => setIsFocusedpass2(true)}
                                                                onBlur={() => setIsFocusedpass2(false)}
                                                                underlineColorAndroid="transparent"
                                                                secureTextEntry={true}
                                                />
                                        </View>
                                    ): (
                                        <View style={{alignContent:'center',alignItems:'center'}}> 
                                          <Ionicons  name="warning" size={50} color="yellow" />
                                          <Text style={{
                                                        // color:'rgba(255,115,96,0.5)',
                                                        color:'rgba(255,255,255,0.6)',
                                                        fontSize:20}}> Se ha producido un error, vuelve al paso anterior </Text>
                                        </View>
                                    )
                                }

                            </View>
                        </ProgressStep>


                    </ProgressSteps>
                </View>
            </PaperProvider>
        )
        }


}


const styles = StyleSheet.create({
    cabeceracontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        // borderBottomColor: 'lightgray',
        
      },
      titulocabecera: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        // color:'white'
      },
    inputtextactivo:{
        //borderBottomColor: 'rgb(44,148,228)', // Cambia el color de la línea inferior aquí
        borderBottomWidth: 2,
        marginBottom:35,
        paddingLeft:10
        
      }
      ,

    

      loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
        justifyContent: 'center',
        alignItems: 'center',
      },

})

export default Seguridad