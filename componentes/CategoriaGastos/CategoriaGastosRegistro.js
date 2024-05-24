import React,{useState,useEffect,useContext} from "react";
import { useRoute } from "@react-navigation/native";
import {  StyleSheet,View,TextInput,Text } from "react-native";
import { Button, Dialog, Portal,PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";
import { AuthContext } from "../../AuthContext";
import { useTheme } from '@react-navigation/native';
import {  ScrollView } from "react-native-gesture-handler";

function CategoriaGastosRegistro({ navigation }){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);
    const { colors } = useTheme();
    const [guardando,setGuardando]=useState(false)
    
    const {params: { concepto },} = useRoute();



    const [codigoconcepto,setCodigoconcepto]=useState(0)
    const [nombreconcepto,setNombreconcepto]=useState('')
    const [isFocusednombre, setIsFocusednombre] = useState(false);
    

    const [focus, setFocus] = useState(false)

    const [visibledialogo, setVisibledialogo] = useState(false)
    const[mensajeerror,setMensajeerror]=useState('')
    const [realizado,setRealizado]=useState(false)

    const showDialog = () => setVisibledialogo(true);
    const hideDialog = () => setVisibledialogo(false);

  

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
            codigocategoria:codigoconcepto,
            
            nombre:nombreconcepto
        

        };
        
        const endpoint='RegistroCategoria/'
        const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
        
        const respuesta=result['resp']
        
        if (respuesta === 200) {
          actualizarEstadocomponente('categoriagasto',!estadocomponente.categoriagasto)
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
            // const concepto={'id':0,'nombre_producto':'','tipoproducto':0}
            
            setCodigoconcepto(concepto.id)
            setNombreconcepto(concepto.nombre_categoria)
            
            
            setRealizado(true)
            
            

           
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
                        


                      <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, borderBottomColor: isFocusednombre ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                    placeholder='Nombre Categoria'
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
    label: {
        fontSize: 16,
        marginBottom: 5,
      },
    containertext:{
      position: 'relative',
    marginBottom: 20, 
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    modalContainer: {
    
    
    paddingBottom:20,
    paddingLeft:20,
    paddingRight:20,
    position: 'absolute',
    bottom: 0,
    left: 5,
    right: 5,
    height:'50%',
    borderTopLeftRadius:50,
    borderTopRightRadius:50,
    borderLeftWidth:1,
    borderTopWidth:1,
    borderRightWidth:1,
    
    borderColor:'gray'
    },
    
    input: {
      borderBottomWidth: 1,
      borderColor: 'gray',
      backgroundColor: 'rgba(128, 128, 128, 0.3)',
      borderRadius: 5,
      fontSize: 15,
      height: 40,
      marginBottom: 7,
      
    },
    inputtextactivo:{
      
      borderBottomWidth: 2,
      marginBottom:35,
      paddingLeft:10
      
    }
    ,
    
  placeholder: {
    position: 'absolute',
    left: 10,
    top: 10,
    fontSize: 15,
    color: 'gray',
    zIndex: -1,
  },
  placeholderFocus: {
    top: -10,
    fontSize: 12,
    color: 'black',
  },
    botonfecha:{
      width: 50, 
      height: 35, 

      marginLeft:'5%',
      marginBottom:27
    },
    botoncomando:{
      backgroundColor: 'blue',
      width: 50, 
      height: 40, 
      borderRadius: 5, 
      justifyContent: 'center', 
      alignItems: 'center',
      marginRight:100
    }
    ,
    contornoopciones:{
      borderWidth:0.5,
      borderColor:'gray',
      marginBottom:15,
      borderRadius:20,
      fontSize:5
    }
  });
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'white',
        paddingRight: 30 // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 12.5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'white',
        // paddingRight: 30, 
        marginBottom:35,
        height:37,
        
    }
});

export default CategoriaGastosRegistro