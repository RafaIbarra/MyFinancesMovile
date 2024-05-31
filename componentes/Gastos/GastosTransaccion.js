import React,{useState,useEffect,useContext} from "react";
import { useRoute } from "@react-navigation/native";

import {  StyleSheet,View,TouchableOpacity,TextInput,Text,Modal } from "react-native";
import { Button, Dialog, Portal,PaperProvider,Divider } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

import { AntDesign } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";
import { AuthContext } from "../../AuthContext";
import { useTheme } from '@react-navigation/native';
import { FlatList, ScrollView } from "react-native-gesture-handler";

function GastosTransaccion({ navigation }){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { reiniciarvalorestransaccion } = useContext(AuthContext);
    const { colors } = useTheme();
    
    const {params: { item },} = useRoute();
    const [guardando,setGuardando]=useState(false)
    const [isFocusedobs, setIsFocusedobs] = useState(false);
    const [isFocusedgasto, setIsFocusedgasto] = useState(false);
    const [estadomodal,setEstadomodal]=useState(false)
    const [datamodal,setDatamodal]=useState([])
    const [datamodalcompleto,setDatamodalcompleto]=useState([])
    const [textobusquedamodal,setTextobusquedamodal]=useState('')
    const [isFocusemodal, setIsFocusedmodal] = useState(false);
    const [modomodal, setModomodal] = useState(0);
    const [modalplaceholder,setModalplaceholder]=useState()
    const [distribucion,setDistribucion]=useState([])
    const [distribucionoriginal,setDistribucionoriginal]=useState([])
    const [distribucionfaltantes,setDistribucionfaltantes]=useState([])
    const [botonfaltantes,setBotonfaltantes]=useState(false)
    
    
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [listagastos,setListagastos]=useState([])
    const [codigoregistro,setCodigoregisto]=useState(0)
    const [optionscategoria, setOptionscategoria] = useState([]);
    const[categoriasel,setCategoriasel]=useState([])
    const [selectedOptioncategoria, setSelectedOptioncategoria] = useState(null);
    const [optionsgasto, setOptionsgasto] = useState([]);
    const [selectedOptiongasto, setSelectedOptiongasto] = useState(null);
    const[gasttosel,setGastosel]=useState(0)
    const[monto,setMonto]=useState(0)
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
    const abrircategoria =()=>{
        setModomodal(1)
        toggleModal()
        
        
        setDatamodal(optionscategoria)
        setDatamodalcompleto(optionscategoria)
        setGastosel([])
        setSelectedOptiongasto(0)
        setModalplaceholder('Buscar Categoria..')
        setTextobusquedamodal('')
        setGastosel('')
      }
    const seleccionopcionmodal=(itemsel)=>{
        
        if(modomodal===1){

            setCategoriasel(itemsel.opcion)
            setSelectedOptioncategoria(itemsel.id)
            const lista_gastos_categoria = listagastos.filter((pro) => pro.categoria === itemsel.id)

            setOptionsgasto(lista_gastos_categoria.map(item => ({
                opcion: item.nombre_gasto,
                id: item.id
              })));
        }else{
            setGastosel(itemsel.opcion)
            setSelectedOptiongasto(itemsel.id)
        }

        toggleModal()

      }
    const abrirgasto =()=>{
        setModomodal(2)
        toggleModal()
        
        setDatamodal(optionsgasto)
        setDatamodalcompleto(optionsgasto)
        setModalplaceholder('Buscar Gasto..')
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

    const cargarmontogasto= (formatted, extracted,key) => {

      const valorformato=formatted.replace(/[,.]/g, '')
      
      
      actualizarMonto(key,valorformato)
      
    };

    const actualizarMonto = (medio, nuevoMonto) => {
      const updatedDistribucion = distribucion.map(item =>
        item.medio === medio ? { ...item, monto: parseInt(nuevoMonto, 10) } : item
      );
      setDistribucion(updatedDistribucion);
      
      if(nuevoMonto.length>0){
        
        sumarmontos(updatedDistribucion)
      }
    };

  const sumarmontos=(distribucionActualizada)=>{
               
    const totalgasto = distribucionActualizada.reduce((acc, item) => acc + item.monto, 0);
    setMonto(totalgasto)
  }

  const comparar = (original, actual) => {
    
    const mediosActuales = actual.map(item => item.medio);
    original.filter(item => !mediosActuales.includes(item.medio));
    valores= original.filter(item => !mediosActuales.includes(item.medio));
    
    return valores
  }
  const agregarfaltantesedicion = (original, actual) => {
    
    const mediosActuales = actual.map(item => item.medio);
    original.filter(item => !mediosActuales.includes(item.medio));
    valores= original.filter(item => !mediosActuales.includes(item.medio));
    
    setDistribucion(prevDistribucion => [...actual, ...valores]);
    ordenarPorNombre()
     
  }
  const eliminarItem = (key) => {
    if (distribucion.length > 1) {
      const updatedDistribucion = distribucion.filter(item => item.key !== key);
      const faltantes = comparar(distribucionoriginal,updatedDistribucion)
      setDistribucionfaltantes(faltantes)
      if (faltantes.length>0){
        setBotonfaltantes(true)
      }
      setDistribucion(updatedDistribucion);
      sumarmontos(updatedDistribucion);
    } else {
      
      setMensajeerror('Se debe incluir al menos un medio de pago')
      showDialog(true)
    }
    
  };
  const cargarfaltantes=()=>{
    setDistribucion(prevDistribucion => [...prevDistribucion, ...distribucionfaltantes]);
    setDistribucionfaltantes([]);
    setBotonfaltantes(false)
    ordenarPorNombre()
  }
  const ordenarPorNombre = () => {
    setDistribucion(prevDistribucion => [...prevDistribucion].sort((a, b) => a.nombre.localeCompare(b.nombre)));
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
        setGuardando(true)
        const filteredData = distribucion.filter(item => item.monto > 0);
        const transformedData = filteredData.map(item => ({ mediopago: item.medio, monto: item.monto }));
        
        const jsonData = JSON.stringify(transformedData);
        const datosregistrar = {
            codgasto:codigoregistro,
            gasto:selectedOptiongasto,
            monto:parseInt(monto,10),
            fecha:fechaegreso,
            anotacion:anotacion,
            distribucion:jsonData

        };
        
        const endpoint='RegistroEgreso/'
        const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
        
        const respuesta=result['resp']
        if (respuesta === 200) {
          
          
          reiniciarvalorestransaccion()
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
        setGuardando(false)

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
            setGuardando(true)
            const body = {};
            const endpoint='MisDatosRegistroEgreso/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            const respuesta=result['resp']
            
            if (respuesta === 200){
                

                const distri=result['data']['datosmedios'].map(a => ({
                  medio: a.id,
                  monto:0,
                  nombre: a.nombre_medio,
                  key:a.id
                }));
                
                
                setDistribucionoriginal(distri)
                setOptionscategoria(result['data']['datoscategorias'].map(a => ({
                  opcion: a.nombre_categoria,
                  id: a.id
                })));

              
                setListagastos(result['data']['datosgastos'])
                setCodigoregisto(item.id)
                if(item.id===0){
                  setDistribucion(distri)
                  setCategoriasel('')
                  setGastosel('')

                }else{
                  const listadocategorias = result['data']['datosgastos']
                  
                  const distriitem=item['Distribucion'].map(a => ({
                    medio: a.mediopago_id,
                    monto:a.monto,
                    nombre: a.descripcionmedio,
                    key:a.mediopago_id
                  }));
                  agregarfaltantesedicion(distri,distriitem)
                  
                  
                  setSelectedOptioncategoria(item.CodigoCategoriaGasto) ;
                  setCategoriasel(item.CategoriaGasto)

                  const lista_gastos_categoria = listadocategorias.filter((pro) => pro.categoria === item.CodigoCategoriaGasto)
                  
                  
                  setOptionsgasto(lista_gastos_categoria.map(item => ({
                    opcion: item.nombre_gasto,
                    id: item.id
                  })));

                  setSelectedOptiongasto(item.gasto);
                  setGastosel(item.NombreGasto)

                  setMonto(item.monto_gasto)
                  setFechaegreso(item.fecha_gasto)
                  setAnotacion(item.anotacion)
                }
                

                setGuardando(false)
                setRealizado(true)
                
            }else if(respuesta === 403 || respuesta === 401){
              setGuardando(false)
                await Handelstorage('borrar')
                await new Promise(resolve => setTimeout(resolve, 1000))
                setActivarsesion(false)
            }
            

           
        }
        cargardatos()
      }, []);

    if(realizado){
        return(
          <ScrollView>

            <PaperProvider >

              {guardando &&(<Procesando></Procesando>)}
              <View style={{flex: 1,justifyContent:'flex-start',marginTop:5}}>

              
                    
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
                  
                  <View style={{height:40, 
                                backgroundColor:'rgba(32,93,93,255)',
                                alignContent:'center',
                                justifyContent:'center',marginLeft:5,marginRight:5,borderRadius:5,
                                borderWidth:0.3,borderColor:colors.bordercolor,marginBottom:5}}>

                    <Text style={{ color: colors.text,marginLeft:20,fontWeight:'bold'}}>DATOS DEL GASTO</Text>
                  </View>

                  <View style={{width:'90%', borderWidth:1,borderColor:'gray',marginLeft:'5%',borderRadius:20 }}>

                      <ScrollView style={{padding:10,maxHeight:160,marginLeft:10,marginRight:10,marginTop:10}}>
                          
            
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

                          <View style={{ flexDirection: 'row', alignItems:'stretch' }}>
                              
                              <Text style={[styles.inputtextactivo, 
                                            { width:'85%',
                                              color: gasttosel ? colors.text : 'gray',
                                              borderBottomColor: gasttosel ? colors.textbordercoloractive : colors.textbordercolorinactive}]} 
                                >
                                {gasttosel ? gasttosel : 'Seleccione Gasto'}

                                
                                
                                </Text>
            
                              <TouchableOpacity 
                                style={styles.botonfecha} 
                                onPress={abrirgasto}>         
                                  <FontAwesome name="search-plus" size={30} color={colors.iconcolor} />
                              </TouchableOpacity>
            
                              
            
                          </View>
                        
                          

                          <View style={{ flexDirection: 'row', alignItems:'stretch' }}>
                              
                              <Text style={[styles.inputtextactivo, 
                                            { width:'50%',
                                              color: fechaegreso ? colors.text : 'gray',
                                              borderBottomColor: fechaegreso ? colors.textbordercoloractive : colors.textbordercolorinactive}]} 
                                onPress={showDatePicker} >
                                {fechaegreso ? moment(fechaegreso).format('DD/MM/YYYY') : 'Fecha Gasto'}
                                
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
                          
                          
                            
                      </ScrollView>
                  </View>

                  <View style={{height:40, 
                                  backgroundColor:'rgba(32,93,93,255)',
                                  alignContent:'center',alignItems:'center',
                                  justifyContent:'space-between',flexDirection:'row',
                                  marginLeft:5,marginRight:5,marginBottom:5,marginTop:20,
                                  borderRadius:5,borderWidth:0.3,borderColor:colors.bordercolor}}>

                          <View>
                              <Text style={{ color: colors.text,marginLeft:20,fontWeight:'bold'}}>MEDIOS DE PAGOS</Text>
                              
                          </View>
                          {botonfaltantes &&(<TouchableOpacity 
                                                style={{width:35,height:35,borderRadius:20,alignItems:'center',
                                                        justifyContent:'center',backgroundColor:'rgb(218,165,32)',marginRight:20,marginTop:2}}
                                                onPress={cargarfaltantes}>
                                                <FontAwesome6 name="add" size={24} color="white" />
                            
                                            </TouchableOpacity>)}
                  </View>

                
                  
                  <ScrollView style={{ padding:10,maxHeight:160,minHeight:40,width:'90%', borderWidth:1,borderColor:'gray',
                  marginLeft:'5%',borderTopLeftRadius:20,borderTopRightRadius:20 }}>
                    
                      
                        {Object.keys(distribucion).map((key) => (
                          <View  key={key} style={{flexDirection:'row',alignContent:'center',alignItems:'center',justifyContent:'space-between',marginBottom:20}}> 
                              <Text style={{ color: colors.text,width:'35%'}}>  {distribucion[key].nombre}</Text>
                              <TextInputMask style={{color: colors.text,backgroundColor:colors.backgroundInpunt, 
                                                      width:'50%',borderBottomWidth: 2,
                                                    borderBottomColor: isFocusedgasto ? colors.textbordercoloractive : colors.textbordercolorinactive }}
                                type={'money'}
                                options={{
                                  precision: 0, // Sin decimales
                                  separator: ',', // Separador de miles
                                  delimiter: '.', // Separador decimal
                                  unit: '', // No se muestra una unidad
                                  suffixUnit: '', // No se muestra una unidad al final
                                }}
                                value={distribucion[key].monto}
                                onChangeText={(formatted, extracted) => cargarmontogasto(formatted, extracted, distribucion[key].key)}
                                onFocus={() => setIsFocusedgasto(true)}
                                onBlur={() => setIsFocusedgasto(false)}
                                underlineColorAndroid="transparent"
                                keyboardType="numeric"
                                placeholder="Monto Gasto"
                                placeholderTextColor='gray'
                              />
                            <TouchableOpacity 
                              style={{width:24,height:24,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:'red'}}
                              onPress={() => eliminarItem(distribucion[key].key)}
                            >

                              {/* <MaterialIcons name="remove-circle" size={24} color="red" /> */}
                              <Ionicons name="remove" size={24} color="white" />
                            </TouchableOpacity>


                          </View>
                        ))}
                    
                  </ScrollView>

                  <View style={{height:40, 
                                  // backgroundColor:'rgba(31,211,164,255)',
                                  backgroundColor:colors.subtitulo,
                                  // backgroundColor:'rgba(101,172,227,255)',
                                  // backgroundColor:'rgba(44,148,228,0.7)',
                                  alignContent:'center',alignItems:'center',
                                  justifyContent:'center',marginLeft:20,marginRight:20,
                                  borderBottomLeftRadius:20,borderBottomRightRadius:20,
                                  // marginBottom:50,
                                  borderWidth:1,borderColor:colors.bordercolor}}>

                          <View>
                              
                              <Text style={{ color: colors.text,marginLeft:20,fontWeight:'bold'}}>TOTAL GASTO Gs.: {Number(monto).toLocaleString('es-ES')} </Text>
                          </View>
                          
                  </View>

                    
                  
                  <TextInput style={[styles.inputtextactivo,{color: colors.text,
                                      backgroundColor:colors.backgroundInpunt, 
                                      marginTop:20,marginLeft:'5%',marginRight:10,marginBottom:30,
                                      borderBottomColor: isFocusedobs ? colors.textbordercoloractive : colors.textbordercolorinactive 
                                    }]}
                                      placeholder='Observacion'
                                      placeholderTextColor='gray'
                                      //label='Obserbacion'
                                      value={anotacion}
                                      // textAlignVertical="center"
                                      onChangeText={anotacion => textoanotacion(anotacion)}
                                      onFocus={() => setIsFocusedobs(true)}
                                      onBlur={() => setIsFocusedobs(false)}
                                      underlineColorAndroid="transparent"
                    />


                  <Button 
                        style={{marginTop:10,marginBottom:10,marginLeft:10,marginRight:10,
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
                                                        fontSize:20}}> SELECCIONE LA CATEGORIA </Text>
                                        </View>
                                      )
                                }
                              </View>
                      
                          </View>
                  </Modal>
                  
                

              </View>
            </PaperProvider>
          </ScrollView>
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
      marginBottom:25,
      paddingLeft:10
      
    }
    ,


    botonfecha:{
      width: 50, 
      height: 35, 

      marginLeft:'5%',
      marginBottom:20
    },


  });


export default GastosTransaccion