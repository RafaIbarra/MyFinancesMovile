import React,{useState,useEffect,useContext} from "react";
import { useRoute } from "@react-navigation/native";

import {  StyleSheet,View,TouchableOpacity,TextInput,Text,Modal } from "react-native";
import { Button, Dialog, Portal,PaperProvider,RadioButton } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

import { AntDesign } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';


import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import { AuthContext } from "../../AuthContext";
import { useTheme } from '@react-navigation/native';
import { FlatList, ScrollView } from "react-native-gesture-handler";

function IngresoTransaccion({ navigation }){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { colors } = useTheme();
    
    const {params: { item },} = useRoute();



    const[productosfijos,setProductosfijos]=useState(null)
    const[productosocacionales,setProductosocacionales]=useState(null)
    const [valueradio, setValueradio] = useState(0);
    const [opcionesconceptos,setOpcionesconceptos]=useState([])
    const [listaconcepto,setListaconcepto]=useState([])
    const[tiposel,setTiposel]=useState([])
    const[conceptosel,setConceptosel]=useState(0)
    const[codigosel,setCodigosel]=useState(0)
    const [codigoregistro,setCodigoregisto]=useState(0)


    const [isFocusedobs, setIsFocusedobs] = useState(false);
    const [isFocusedgasto, setIsFocusedgasto] = useState(false);
    const [estadomodal,setEstadomodal]=useState(false)
    const [datamodal,setDatamodal]=useState([])
    const [datamodalcompleto,setDatamodalcompleto]=useState([])
    const [textobusquedamodal,setTextobusquedamodal]=useState('')
    const [isFocusemodal, setIsFocusedmodal] = useState(false);
    //const [modomodal, setModomodal] = useState(0);
    const [modalplaceholder,setModalplaceholder]=useState()

    
    
    // const [listagastos,setListagastos]=useState([])
    // 
    // const [optionscategoria, setOptionscategoria] = useState([]);
    // const[categoriasel,setCategoriasel]=useState([])
    // const [optionsgasto, setOptionsgasto] = useState([]);
    // const [selectedOptioncategoria, setSelectedOptioncategoria] = useState(null);
    // const [selectedOptiongasto, setSelectedOptiongasto] = useState(null);
    // const[gasttosel,setGastosel]=useState(0)


    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const[monto,setMonto]=useState('')
    const[anotacion,setAnotacion]=useState('')
    const [fechaegreso, setFechaegreso] = useState('');
    const [realizado,setRealizado]=useState(false)
    const [focus, setFocus] = useState(false)

    const [visibledialogo, setVisibledialogo] = useState(false)
    const[mensajeerror,setMensajeerror]=useState('')

    const showDialog = () => setVisibledialogo(true);
    const hideDialog = () => setVisibledialogo(false);

    const toggleModal = () => {
        setEstadomodal(!estadomodal);
     
    };

    const seleccionradio =(valor)=>{
        setValueradio(valor)
        setConceptosel('')
        setCodigosel(0)
        if (valor===1){


            const filtrar=(productosfijos.map(a => ({
                opcion: a.nombre_producto,
                id: a.id
              })));
            
            setDatamodal(filtrar)
            setDatamodalcompleto(filtrar)
        } else if(valor===2){


            
            const filtrar=(productosocacionales.map(a => ({
                opcion: a.nombre_producto,
                id: a.id
              })));
            
            setDatamodal(filtrar)
            setDatamodalcompleto(filtrar)
        }
    }
    
    const seleccionopcionmodal=(itemsel)=>{
  
        setConceptosel(itemsel.opcion)
        setCodigosel(itemsel.id)
        toggleModal()

      }
    const abrirgasto =()=>{
        
        toggleModal()
        setModalplaceholder('Buscar Ingreso..')
        setTextobusquedamodal('')
      }
    

    const realizarbusquedamodal= (palabra)=>{
        setTextobusquedamodal(palabra)
        const pal =palabra.toLowerCase()
        let arrayencontrado = datamodalcompleto.filter(item => 
          item.opcion.toLowerCase().includes(pal)
          
          );
        setDatamodal(arrayencontrado)
      }

    const handleTextChange = (formatted, extracted) => {
        const valorformato=formatted.replace(/[,.]/g, '')
        
        setMonto(valorformato);
      };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
   
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };
    
    const handleConfirm = (date) => {
        
        const fechaFormateada = new Date(date).toISOString().split('T')[0]
        
        setFechaegreso(fechaFormateada)
        hideDatePicker();
      };

    const registrar_egreso = async () => {



        const datosregistrar = {
          codingreso:codigoregistro,
          producto:codigosel,
          monto:parseInt(monto,10),
          fecha:fechaegreso,
          anotacion:anotacion,
            

        };
        
        const endpoint='RegistroIngreso/'
        const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
        
        const respuesta=result['resp']
        if (respuesta === 200) {
          
          item.recarga='si'
      
  
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

    const textoanotacion=(valor)=>{
      setAnotacion(valor)
      if (!focus && valor !== '') {
        setFocus(true);
      } else if (focus && valor === '') {
        setFocus(false);
      }
    }

    useEffect(() => {

        const cargardatos=async()=>{
        
            const body = {};
            const endpoint='MisProductosFinancieros/0/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            const respuesta=result['resp']
            if (respuesta === 200){
              
                
                const lista=result['data']
                const listafijos = lista.filter((fij) => fij.tipoproducto === 1);
                const listasocacionales = lista.filter((oca) => oca.tipoproducto === 2);

                setProductosfijos(listafijos)
                setProductosocacionales(listasocacionales)
            
                setListaconcepto(result['data'])
                setCodigoregisto(item.id)
                if(item.id===0){
                  setTiposel('')
                  setConceptosel('')

                }else{
                  const listadoconceptos = result['data']

                  let tipoitem=0
                  if (item.TipoIngreso==='Ocasionales'){
                    setValueradio(2)
                    tipoitem=2
                  }else {
                    setValueradio(1)
                    tipoitem=1
                  }
                  setConceptosel(item.NombreIngreso)
                  setCodigosel(item.producto_financiero)

                  const lista_productos_tipo= listadoconceptos.filter((pro) => pro.tipoproducto === tipoitem)
                  
                  
                  const itemodal=(lista_productos_tipo.map(itemtipo => ({
                    opcion: itemtipo.nombre_producto,
                    id: itemtipo.id
                  })));

                  setDatamodal(itemodal)
                  setDatamodalcompleto(itemodal)
                  setMonto(item.monto_ingreso)
                  setFechaegreso(item.fecha_ingreso)
                  setAnotacion(item.anotacion)
                }
                

                
                setRealizado(true)
                
            }else if(respuesta === 403 || respuesta === 401){
                await Handelstorage('borrar')
                await new Promise(resolve => setTimeout(resolve, 1000))
                setActivarsesion(false)
            }
            

           
        }
        cargardatos()
      }, []);

    if(realizado){
        return(

          <PaperProvider >
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
                                maxHeight:350,
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
            
                        <View style={{ flexDirection: 'row', alignItems:'stretch' }}>
                          
                            <Text style={[styles.inputtextactivo, 
                                            { width:'85%',
                                            color: conceptosel ? colors.text : 'gray',
                                            borderBottomColor: conceptosel ? colors.textbordercoloractive : colors.textbordercolorinactive}]} 
                                >
                                {conceptosel ? conceptosel : 'Seleccione Concepto Ingreso..'}

                                
                                
                                </Text>
            
                            <TouchableOpacity 
                                style={styles.botonfecha} 
                                onPress={abrirgasto}>         
                                <FontAwesome name="search-plus" size={30} color={colors.iconcolor} />
                            </TouchableOpacity>
        
                      </View>

                      
                     
                        <TextInputMask style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, 
                                          borderBottomColor: isFocusedgasto ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                  type={'money'}
                                  options={{
                                    precision: 0, // Sin decimales
                                    separator: ',', // Separador de miles
                                    delimiter: '.', // Separador decimal
                                    unit: '', // No se muestra una unidad
                                    suffixUnit: '', // No se muestra una unidad al final
                                  }}
                                  value={monto}
                                  onChangeText={handleTextChange}
                                  onFocus={() => setIsFocusedgasto(true)}
                                  onBlur={() => setIsFocusedgasto(false)}
                                  underlineColorAndroid="transparent"
                                  keyboardType="numeric"
                                  placeholder="Monto Ingreso"
                                  placeholderTextColor='gray'
                                />

                      <View style={{ flexDirection: 'row', alignItems:'stretch' }}>
                          
                          <Text style={[styles.inputtextactivo, 
                                        { width:'50%',
                                          color: fechaegreso ? colors.text : 'gray',
                                          borderBottomColor: fechaegreso ? colors.textbordercoloractive : colors.textbordercolorinactive}]} 
                            onPress={showDatePicker} >
                            {fechaegreso ? moment(fechaegreso).format('DD/MM/YYYY') : 'Fecha Ingreso'}
                            
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
                      <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, borderBottomColor: isFocusedobs ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                    placeholder='Observacion'
                                    placeholderTextColor='gray'
                                    value={anotacion}
                                    onChangeText={anotacion => textoanotacion(anotacion)}
                                    onFocus={() => setIsFocusedobs(true)}
                                    onBlur={() => setIsFocusedobs(false)}
                                    underlineColorAndroid="transparent"
                      />
                      
                        
                  </ScrollView>
                  <Button 
                        style={{marginTop:10,marginBottom:10,marginLeft:10
                          ,
                        
                          backgroundColor:'rgba(44,148,228,0.7)'
                        }} 
                     
                        icon={() => {
                          

                          return <MaterialCommunityIcons name="content-save-check" size={30} color="white" />
                        }}
                        mode="elevated" 
                        textColor="white"
                        onPress={registrar_egreso}>
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
                                  placeholder={modalplaceholder}
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
                                                        fontSize:20}}> SELECCIONE EL TIPO </Text>
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

export default IngresoTransaccion