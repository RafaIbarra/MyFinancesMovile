import React,{useState,useEffect} from "react";
import { ActivityIndicator, View,Text,StyleSheet,TouchableOpacity,TextInput } from "react-native";
import { Button, Dialog, Portal,PaperProvider } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import { AuthContext } from "../../AuthContext";
import moment from 'moment';
import { useTheme } from '@react-navigation/native';
import { ScrollView } from "react-native-gesture-handler";

import { AntDesign } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons';


function DatosPersonales({navigation}){
    const { colors } = useTheme();
    const [nombre,setNombre]=useState('')
    const [apellido,setApellido]=useState('')
    const [fechanac,setFechanac]=useState('')
    const [username,setUsername]=useState('')
    const [correo,setCorreo]=useState('')



    const [visibledialogo, setVisibledialogo] = useState(false)
    const[mensajeerror,setMensajeerror]=useState('')

    const [focusnombre, setFocusnombre] = useState(false)
    const [isFocusednombre, setIsFocusednombre] = useState(false);

    const [isFocusedapellido, setIsFocusedapellido] = useState(false);
    const [focusapellido, setFocusapellido] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [isFocusedcorreo, setIsFocusedcorreo] = useState(false)
    const [focuscorreo, setFocuscorreo] = useState(false)


    const showDialog = () => setVisibledialogo(true);
    const hideDialog = () => setVisibledialogo(false);


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
        } else if (focusnombre && valor === '') {
            setFocusapellido(false);
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

      const registrar = async () => {
        
        const body = {
            nombre:nombre,
            apellido:apellido,
            fechanacimiento:fechanac,
            correo:correo,
        
        };
        
        const endpoint='ActualizarDatosUsuario/'
        const result = await Generarpeticion(endpoint, 'POST', body);
        
        const respuesta=result['resp']
        if (respuesta === 200) {
          
          
      
  
          navigation.goBack();
          
        } else if(respuesta === 403 || respuesta === 401){

          await Handelstorage('borrar')
          await new Promise(resolve => setTimeout(resolve, 1000))
          setActivarsesion(false)
        } else{
         setMensajeerror( result['data']['error'])
         showDialog(true)
        }
        

     };



    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
       
            const cargardatos=async()=>{
                const body = {};
                const endpoint='ObtenerDatosUsuario/'
                const result = await Generarpeticion(endpoint, 'POST', body);
                
                const respuesta=result['resp']
                
                if (respuesta === 200) {
    
                    const registros=result['data']
                    
                   
                   
                   setNombre(result['data'][0].nombre_usuario)
                   setApellido(result['data'][0].apellido_usuario)
                   setFechanac(result['data'][0].fecha_nacimiento)
                   setUsername(result['data'][0].user_name)
                   setCorreo(result['data'][0].correo)
                    
                    
                }else if(respuesta === 403 || respuesta === 401){
                    
                    
                    await Handelstorage('borrar')
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    setActivarsesion(false)
                }
                
               
    
               
            }
            cargardatos()
        
        
        })
        return unsubscribe;
        
      }, [navigation]);

    return (

        <PaperProvider>
            <View style={{flex: 1,justifyContent:'flex-start',marginTop:75}}>
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

                <ScrollView style={{padding:10,maxHeight:350,marginLeft:10,marginRight:10}}>

                    <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, 
                                        borderBottomColor: isFocusednombre ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                        placeholder='Nombre'
                                        placeholderTextColor='gray'
                                        //label='Obserbacion'
                                        value={nombre}
                                        // textAlignVertical="center"
                                        onChangeText={nombre => textonombre(nombre)}
                                        onFocus={() => setIsFocusednombre(true)}
                                        onBlur={() => setIsFocusednombre(false)}
                                        underlineColorAndroid="transparent"
                        />

                    <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, 
                                        borderBottomColor: isFocusedapellido ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                        placeholder='Apellido'
                                        placeholderTextColor='gray'
                                        //label='Obserbacion'
                                        value={apellido}
                                        // textAlignVertical="center"
                                        onChangeText={apellido => textoapellido(nombre)}
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
                            {fechanac ? moment(fechanac).format('DD/MM/YYYY') : 'Fecha Gasto'}
                            
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

                    <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, 
                                        borderBottomColor: isFocusedcorreo ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
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


                </ScrollView>

                <Button 
                        style={{marginTop:10,marginBottom:10,marginLeft:10
                          ,
                          // backgroundColor:'rgb(182, 212, 212)'
                          //backgroundColor:'rgba(0,0,0,0.2)'
                          backgroundColor:'rgba(44,148,228,0.7)'
                        }} 
                        // icon="content-save-check" 
                        icon={() => {
                          // return <AntDesign style={{marginRight:5,marginTop:5}} name="downcircle" size={27} color="gray" />;

                          return <MaterialCommunityIcons name="content-save-check" size={30} color="white" />
                        }}
                        mode="elevated" 
                        textColor="white"
                        onPress={registrar}>
                        ACTUALIZAR 
                  </Button>

            </View>
        </PaperProvider>
        
    )
}

const styles = StyleSheet.create({

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

})

export default DatosPersonales