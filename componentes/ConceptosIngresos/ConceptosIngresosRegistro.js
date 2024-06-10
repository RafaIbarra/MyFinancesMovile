import React,{useState,useEffect,useContext} from "react";
import { useRoute } from "@react-navigation/native";

import {  StyleSheet,View,TextInput,Text,Modal } from "react-native";
import { Button, Dialog, Portal,PaperProvider,RadioButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";
import { AuthContext } from "../../AuthContext";
import { useTheme } from '@react-navigation/native';
import {  ScrollView } from "react-native-gesture-handler";

function ConceptosIngresosRegistro({ navigation }){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);
    const { reiniciarvalorestransaccion } = useContext(AuthContext);
    const { colors } = useTheme();
    
    const {params: { concepto },} = useRoute();

    const [guardando,setGuardando]=useState(false)

    const [codigoconcepto,setCodigoconcepto]=useState(0)
    const [nombreconcepto,setNombreconcepto]=useState('')
    const [isFocusednombre, setIsFocusednombre] = useState(false);
    const [valueradio, setValueradio] = useState(0);

    const [focus, setFocus] = useState(false)

    const [visibledialogo, setVisibledialogo] = useState(false)
    const[mensajeerror,setMensajeerror]=useState('')
    const [realizado,setRealizado]=useState(false)

    const showDialog = () => setVisibledialogo(true);
    const hideDialog = () => setVisibledialogo(false);

  

    const seleccionradio =(valor)=>{
        setValueradio(valor)
       
    }
    const textoanotacion=(valor)=>{
        setNombreconcepto(valor)
        if (!focus && valor !== '') {
          setFocus(true);
        } else if (focus && valor === '') {
          setFocus(false);
        }
      }
    
    const registrar_concepto = async () => {
        setGuardando(true)


        const datosregistrar = {
            codigoproducto:codigoconcepto,
            tipoproducto:valueradio,
            nombre:nombreconcepto
        

        };
        
        const endpoint='RegistroProductoFinanciero/'
        const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
        
        const respuesta=result['resp']
        if (respuesta === 200) {
          actualizarEstadocomponente('conceptosingresos',!estadocomponente.conceptosingresos)
          reiniciarvalorestransaccion()
          concepto.recarga='si'
      
  
          navigation.goBack();
          
        } else if(respuesta === 403 || respuesta === 401){

          await Handelstorage('borrar')
          await new Promise(resolve => setTimeout(resolve, 1000))
          setActivarsesion(false)
        } else{
         setMensajeerror( result['data']['error'])
         showDialog(true)
        }
        
        setGuardando(false)
     };

    useEffect(() => {

        const cargardatos=()=>{
     
            setGuardando(true)
            setCodigoconcepto(concepto.id)
            setNombreconcepto(concepto.nombre_producto)
            setValueradio(concepto.tipoproducto)
            
            setRealizado(true)
            setGuardando(false)
            

           
        }
        cargardatos()
      }, []);

    if(realizado){
        return(

          <PaperProvider >
             {guardando &&(<Procesando></Procesando>)}
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
                  
                  <ScrollView style={{padding:10,
                                maxHeight:200,
                                marginLeft:10,
                                marginRight:10
                                
                                
                                }}>
                        <RadioButton.Group 
                            onValueChange={newValue => seleccionradio(newValue)} 
                            value={valueradio}
                            >
                            <View style={{flexDirection:'row',marginBottom:35,paddingLeft:10,alignItems:'center'}}>
                                <Text style={{color:colors.text,marginRight:20}}>Tipo Ingreso:</Text>
                                <View style={{flexDirection:'row',alignContent:'center',alignItems:'center',marginRight:50}}>
                                    <Text style={{color:colors.text}}>Fijo</Text>
                                    <RadioButton value={1} color="rgb(44,148,228)" uncheckedColor={colors.text}/>
                                </View>
                                <View style={{flexDirection:'row',alignContent:'center',alignItems:'center'}}> 
                                    <Text style={{color:colors.text}}>Ocasionales</Text>
                                    <RadioButton value={2}  color="rgb(44,148,228)"  uncheckedColor={colors.text} />
                                </View>
                            </View>

                        </RadioButton.Group>


                      <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, borderBottomColor: isFocusednombre ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                    placeholder='Nombre Concepto'
                                    placeholderTextColor='gray'
                                    value={nombreconcepto}
                                    onChangeText={nombreconcepto => textoanotacion(nombreconcepto)}
                                    onFocus={() => setIsFocusednombre(true)}
                                    onBlur={() => setIsFocusednombre(false)}
                                    underlineColorAndroid="transparent"
                      />
                      
                        
                  </ScrollView>
                  <Button 
                        style={{marginBottom:10,marginLeft:10
                          ,
                        
                          backgroundColor:'rgba(44,148,228,0.7)'
                        }} 
                     
                        icon={() => {
                          

                          return <MaterialCommunityIcons name="content-save-check" size={30} color="white" />
                        }}
                        mode="elevated" 
                        textColor="white"
                        onPress={registrar_concepto}>
                        REGISTRAR 
                  </Button>


            </View>
          </PaperProvider>
        )
    }
}

const styles = StyleSheet.create({


    
    input: {
      borderBottomWidth: 1,
      borderColor: 'gray',
      backgroundColor: 'rgba(128, 128, 128, 0.3)',
      borderRadius: 5,
      fontSize: 15,
      height: 40,
      marginBottom: 7,
      //paddingHorizontal: 5, // Espacio interno horizontal
    },
    inputtextactivo:{
      //borderBottomColor: 'rgb(44,148,228)', // Cambia el color de la línea inferior aquí
      borderBottomWidth: 2,
      marginBottom:35,
      paddingLeft:10
      
    }
    
  });


export default ConceptosIngresosRegistro