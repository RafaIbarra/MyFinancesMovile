import React,{useState,useEffect,useContext} from "react";
import { useRoute } from "@react-navigation/native";

import {  StyleSheet,View,TouchableOpacity,TextInput,Text,Modal } from "react-native";
import { Button, Dialog, Portal,PaperProvider,RadioButton } from 'react-native-paper';



import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';



import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";
import { AuthContext } from "../../AuthContext";
import { useTheme } from '@react-navigation/native';
import { FlatList, ScrollView } from "react-native-gesture-handler";

function ConceptosGastosRegistro({ navigation }){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { colors } = useTheme();
    const [guardando,setGuardando]=useState(false)
    const {params: { concepto },} = useRoute();



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

    const [optionscategoria, setOptionscategoria] = useState([]);
    const[categoriasel,setCategoriasel]=useState([])
    const [estadomodal,setEstadomodal]=useState(false)
    const [datamodal,setDatamodal]=useState([])
    const [datamodalcompleto,setDatamodalcompleto]=useState([])
    const[gasttosel,setGastosel]=useState(0)
    const [textobusquedamodal,setTextobusquedamodal]=useState('')
    const [isFocusemodal, setIsFocusedmodal] = useState(false);
    const [selectedOptioncategoria, setSelectedOptioncategoria] = useState(null);

  

    const seleccionradio =(valor)=>{
        setValueradio(valor)
       
    }
    const toggleModal = () => {
        setEstadomodal(!estadomodal);
        
       
        
      };
    const abrircategoria =()=>{
        
        toggleModal()
        
        
        setDatamodal(optionscategoria)
        setDatamodalcompleto(optionscategoria)
        setGastosel([])
        
        setTextobusquedamodal('')
        // setGastosel('')
      }
    const realizarbusquedamodal= (palabra)=>{
        setTextobusquedamodal(palabra)
        const pal =palabra.toLowerCase()
        let arrayencontrado = datamodalcompleto.filter(item => 
          item.opcion.toLowerCase().includes(pal)
          
          );
        setDatamodal(arrayencontrado)
      }
      const seleccionopcionmodal=(itemsel)=>{
        
        

            setCategoriasel(itemsel.opcion)
            setSelectedOptioncategoria(itemsel.id)
            
       

        toggleModal()

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
            codigogasto:codigoconcepto,
            tipogasto:valueradio,
            categoria:selectedOptioncategoria,
            nombre:nombreconcepto
        

        };
        
        const endpoint='RegistroGasto/'
        const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
        
        const respuesta=result['resp']
        if (respuesta === 200) {
          
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

        const cargardatos= async()=>{
            // const concepto={'id':0,'nombre_producto':'','tipoproducto':0}
            setGuardando(true)
            setCodigoconcepto(concepto.id)
            setNombreconcepto(concepto.nombre_gasto)
            setValueradio(concepto.tipogasto)
            setSelectedOptioncategoria(concepto.categoria)
            setCategoriasel(concepto.DescripcionCategoriaGasto)

            const body = {};
            const endpoint='MisDatosRegistroEgreso/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            const respuesta=result['resp']
            if (respuesta === 200){
              
                setOptionscategoria(result['data']['datoscategorias'].map(a => ({
                  opcion: a.nombre_categoria,
                  id: a.id
                })));

              
                
                
                

                
                setRealizado(true)
                
            }else if(respuesta === 403 || respuesta === 401){
                await Handelstorage('borrar')
                await new Promise(resolve => setTimeout(resolve, 1000))
                setActivarsesion(false)
            }
            setGuardando(false)
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
                    <RadioButton.Group 
                        onValueChange={newValue => seleccionradio(newValue)} 
                        value={valueradio}
                        >
                        <View style={{flexDirection:'row',marginBottom:35,paddingLeft:10,alignItems:'center'}}>
                            <Text style={{color:colors.text,marginRight:20}}>Tipo Gasto:</Text>
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

                    <View style={{ flexDirection: 'row', alignItems:'stretch' }}>
                        
                        <Text style={[styles.inputtextactivo, 
                                    { width:'85%',
                                        color: categoriasel ? colors.text : 'gray',
                                        borderBottomColor: categoriasel ? colors.textbordercoloractive : colors.textbordercolorinactive}]} 
                            >
                        {categoriasel ? categoriasel : 'Seleccione Categoria'}
                        </Text>
    
                        <TouchableOpacity 
                        style={styles.botonfecha} 
                        onPress={abrircategoria}>         
                            <FontAwesome name="search-plus" size={30} color={colors.iconcolor} />
                        </TouchableOpacity>
    
                        
    
                    </View>


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

                <Modal visible={estadomodal} 
                          transparent={true} 
                          onRequestClose={toggleModal}
                          animationType="slide" 
                          // animationDuration={2000}
                          >
                          <TouchableOpacity
                              style={styles.overlay}
                              activeOpacity={1}
                              onPress={toggleModal}
                          />

                          <View style={[styles.modalContainer,{backgroundColor:'rgb(28,44,52)'}]}>
                              <View style={{alignItems:'center',marginBottom:30,marginTop:5}}>
                                  <View style={{borderBottomWidth: 3,borderBottomColor: 'white',width:300,marginVertical: 10,}}></View>
                                  <View style={{borderBottomWidth: 1,borderBottomColor: 'white',width:250,marginVertical: 3,}}></View>
                                  <View></View>
                              </View>
                              <TextInput style={[{borderBottomWidth: 2,marginBottom:10,color: colors.text,backgroundColor:colors.backgroundInpunt, 
                                                  borderBottomColor: isFocusemodal ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                  placeholder='Seleccionar Categoria'
                                  placeholderTextColor='gray'
                                  value={textobusquedamodal}
                                  onChangeText={textobusquedamodal => realizarbusquedamodal(textobusquedamodal)}
                                  onFocus={() => setIsFocusedmodal(true)}
                                  onBlur={() => setIsFocusedmodal(false)}
                              > 
                                  
                              </TextInput>
                              <View style={{borderTopColor:colors.bordercolor,borderWidth:2,borderBottomLeftRadius:20,borderBottomRightRadius:20,marginTop:10,height:'70%'}} >
                                {
                                  datamodal && datamodal.length > 0 ?(

                                    <FlatList
                                    data={datamodal}
                                    renderItem={({item}) =>{
                                        return(
                                                <View style={{marginLeft:15,marginRight:15,borderBottomWidth:0.5,borderBottomColor:'white',marginBottom:10,padding:10}} >

                                                    <TouchableOpacity onPress={()=>seleccionopcionmodal(item)}>
                                                        <Text style={{color:colors.text}}>{item.opcion}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                )
                                        }
                                    }
                                    keyExtractor={item => item.id}

                                    />
                                  ) : (
                                        <View style={{alignContent:'center',alignItems:'center',marginTop:'20%'}}> 
                                          <Ionicons  name="warning" size={50} color="yellow" />
                                          <Text style={{
                                                        // color:'rgba(255,115,96,0.5)',
                                                        color:'rgba(255,255,255,0.6)',
                                                        fontSize:20}}> SELECCIONE LA CATEGORIA </Text>
                                        </View>
                                      )
                                }
                              </View>
                      
                          </View>
                  </Modal>


            </View>
          </PaperProvider>
        )
    }
}

const styles = StyleSheet.create({


    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    modalContainer: {
    
    // padding: 20,
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
      //paddingHorizontal: 5, // Espacio interno horizontal
    },
    inputtextactivo:{
      //borderBottomColor: 'rgb(44,148,228)', // Cambia el color de la línea inferior aquí
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

    
  });


export default ConceptosGastosRegistro