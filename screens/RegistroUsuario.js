import React,{useState,useEffect, useContext,useRef } from "react";
import {View,Text,SafeAreaView,StyleSheet,TextInput,TouchableOpacity  } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

import { Button, Dialog, Portal,PaperProvider } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@react-navigation/native';
import { ScrollView } from "react-native-gesture-handler";

import { AntDesign } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons';
import Handelstorage from "../Storage/handelstorage";
import Procesando from "../componentes/Procesando/Procesando";
import ApiRegistroUsuario from "../componentes/PeticionesApi/apiregistrousuario";
import { AuthContext } from "../AuthContext";

function RegistroUsuario({ navigation  }){

    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const {periodo, setPeriodo} = useContext(AuthContext);
    const {sesiondata, setSesiondata} = useContext(AuthContext);
    const { colors } = useTheme();
    const { navigate } = useNavigation();
    const [guardando,setGuardando]=useState(false)

    const [nombre,setNombre]=useState('')
    const [isFocusednombre, setIsFocusednombre] = useState(false);
    const [focusnombre, setFocusnombre] = useState(false);


    const [apellido,setApellido]=useState('')
    const [isFocusedapellido, setIsFocusedapellido] = useState(false);
    const [focusapellido, setFocusapellido] = useState(false);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [fechanac,setFechanac]=useState('')

    const [username,setUsername]=useState('')
    const [isFocusedusername, setIsFocusedusername] = useState(false);
    const [focususername, setFocususername] = useState(false);

    const [correo,setCorreo]=useState('')
    const [isFocusedcorreo, setIsFocusedcorreo] = useState(false);
    const [focuscorreo, setFocuscorreo] = useState(false);

    const [pass,setPass]=useState('')
    const [isFocusedpass, setIsFocusedpass] = useState(false);
    const [focuspass, setFocuspass] = useState(false);

    const [visibledialogo, setVisibledialogo] = useState(false)
    const[mensajeerror,setMensajeerror]=useState('')

    const showDialog = () => setVisibledialogo(true);
    const hideDialog = () => setVisibledialogo(false);


    const textonombre=(valor)=>{
        setNombre(valor)
        if (!focusnombre && valor !== '') {
            setFocusnombre(true);
        } else if (focusnombre && valor === '') {
            setFocusnombre(false);
        }
      }

    const textoapellido=(valor)=>{
        setApellido(valor)
        if (!focusapellido && valor !== '') {
            setFocusapellido(true);
        } else if (focusapellido && valor === '') {
            setFocusapellido(false);
        }
      }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
   
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };
    
    const handleConfirm = (date) => {
        
        const fechaFormateada = new Date(date).toISOString().split('T')[0]
        
        setFechanac(fechaFormateada)
        hideDatePicker();
      };

    const textousername=(valor)=>{
        setUsername(valor)
        if (!focususername && valor !== '') {
            setFocususername(true);
        } else if (focususername && valor === '') {
            setFocususername(false);
        }
      }

    const textocorreo=(valor)=>{
        setCorreo(valor)
        if (!focuscorreo && valor !== '') {
            setFocuscorreo(true);
        } else if (focuscorreo && valor === '') {
            setFocuscorreo(false);
        }
      }

    const textopass=(valor)=>{
        setPass(valor)
        if (!focuspass && valor !== '') {
            setFocuspass(true);
        } else if (focuspass && valor === '') {
            setFocuspass(false);
        }
      }
    const volver=()=>{
        navigate("LoginStack")
    }

    const registrar = async()=>{
        setGuardando(true)
        const datosregistrar = {
            nombre:nombre,
            apellido:apellido,
            nacimiento:fechanac,
            user:username,
            correo:correo,
            password:pass
            

        };

        
        const datos =await ApiRegistroUsuario(datosregistrar)
        
        if(datos['resp']===200){
            
            
            const userdata={
                token:datos['data']['token'],
                sesion:datos['data']['sesion'],
                refresh:datos['data']['refresh'],
                user_name:datos['data']['user_name'],
            }
            
            await Handelstorage('agregar',userdata,'')
            await new Promise(resolve => setTimeout(resolve, 2000))
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
            const errores=datos['data']['error']
            let mensajeerror = 'Errores: ';
            for (let clave in errores) {
                mensajeerror += `${clave}: ${errores[clave]}. `;
            }

            setMensajeerror(mensajeerror)
            showDialog(true)
        }
    }
    return(
        
            <PaperProvider>
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
                <View style={{flex:1,marginTop:20}}>

                    <View style={[styles.cabeceracontainer,{borderBottomColor:colors.bordercolor}]}>
                       <Text style={[styles.titulocabecera, { color: colors.text}]}>Datos Personales</Text>

                       
                    </View>
                    <ScrollView style={{padding:10,maxHeight:400,marginLeft:10,marginRight:10}}>

                        <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, borderBottomColor: isFocusednombre ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                                placeholder='Nombres'
                                                placeholderTextColor='gray'
                                                //label='Obserbacion'
                                                value={nombre}
                                                // textAlignVertical="center"
                                                onChangeText={nombre => textonombre(nombre)}
                                                onFocus={() => setIsFocusednombre(true)}
                                                onBlur={() => setIsFocusednombre(false)}
                                                underlineColorAndroid="transparent"
                                />
                        <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, borderBottomColor: isFocusedapellido ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                                placeholder='Apellidos'
                                                placeholderTextColor='gray'
                                                //label='Obserbacion'
                                                value={apellido}
                                                // textAlignVertical="center"
                                                onChangeText={apellido => textoapellido(apellido)}
                                                onFocus={() => setIsFocusedapellido(true)}
                                                onBlur={() => setIsFocusedapellido(false)}
                                                underlineColorAndroid="transparent"
                                />

                        <View style={{ flexDirection: 'row', alignItems:'stretch' }}>
                            
                            <Text style={[styles.inputtextactivo, 
                                            { width:'50%',
                                            color: fechanac ? colors.text : 'gray',
                                            borderBottomColor: fechanac ? colors.textbordercoloractive : colors.textbordercolorinactive}]} 
                                onPress={showDatePicker} >
                                {fechanac ? moment(fechanac).format('DD/MM/YYYY') : 'Fecha Nacimiento'}
                                
                                </Text>
            
                            <TouchableOpacity 
                                style={styles.botonfecha} 
                                onPress={showDatePicker}>         
                                <AntDesign name="calendar" size={30} color={colors.iconcolor} />
                            </TouchableOpacity>
            
                            <DateTimePickerModal
                                
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                            />
            
                        </View>

                        <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, borderBottomColor: isFocusedusername ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                                placeholder='User Name'
                                                placeholderTextColor='gray'
                                                //label='Obserbacion'
                                                value={username}
                                                // textAlignVertical="center"
                                                onChangeText={username => textousername(username)}
                                                onFocus={() => setIsFocusedusername(true)}
                                                onBlur={() => setIsFocusedusername(false)}
                                                underlineColorAndroid="transparent"
                                />
                        <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, borderBottomColor: isFocusedcorreo ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                                placeholder='Correo Electronico'
                                                placeholderTextColor='gray'
                                                //label='Obserbacion'
                                                value={correo}
                                                // textAlignVertical="center"
                                                onChangeText={correo => textocorreo(correo)}
                                                onFocus={() => setIsFocusedcorreo(true)}
                                                onBlur={() => setIsFocusedcorreo(false)}
                                                underlineColorAndroid="transparent"
                                />

                        <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, borderBottomColor: isFocusedpass ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                                placeholder='Contraseña'
                                                placeholderTextColor='gray'
                                                //label='Obserbacion'
                                                value={pass}
                                                // textAlignVertical="center"
                                                onChangeText={pass => textopass(pass)}
                                                onFocus={() => setIsFocusedpass(true)}
                                                onBlur={() => setIsFocusedpass(false)}
                                                secureTextEntry={true}
                                                underlineColorAndroid="transparent"
                                />
                    </ScrollView>
                    <View style={{flex:1,alignContent:'center',alignItems:'center'}}>

                        {/* <Button style={{width:'100%'}} icon="account-check-outline" mode="contained" onPress={() => registrar()}>
                            REGISTRARSE
                        </Button> */}


                        <Button style={{marginBottom:10,width:'90%',height:50,backgroundColor:'rgba(44,148,228,0.7)',justifyContent:'center'}} 
                     
                            icon={() => {return <FontAwesome5 name="user-plus" size={30} color="white" />}}
                            mode="elevated" 
                            textColor="white"
                            onPress={() => registrar()}
                        >
                            REGISTRARSE 
                        </Button>



                        <Text style={styles.textPulsa}>
                            ¿Ya tienes una cuenta?{' '}
                            <TouchableOpacity onPress={() => volver()}>
                                <Text style={styles.linkText}>Volver al Login.</Text>
                            </TouchableOpacity>
                        </Text>
                    </View>
                </View>
            </PaperProvider>

        
    )
}

const styles = StyleSheet.create({

    cabeceracontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        marginBottom:50,
        
        
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
      botonfecha:{
        width: 50, 
        height: 35, 
  
        marginLeft:'5%',
        marginBottom:27
      },

    textPulsa: {
        color: 'white',
        textAlign: 'center',
        width: 300,
        marginTop: 40,
      },

      linkText: {
        color: 'rgba(218,165,32,0.7)',
        textDecorationLine: 'underline',
        top: 5,
      },
      

})

export default RegistroUsuario