import React,{useState,useEffect,useContext} from "react";
import { useRoute } from "@react-navigation/native";
// import { useNavigation } from '@react-navigation/native';
import {  StyleSheet,View,TouchableOpacity,TextInput,Text,Modal,Pressable } from "react-native";
import { Button } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

import { AntDesign } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import { FontAwesome } from '@expo/vector-icons';
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import { AuthContext } from "../../AuthContext";
import { useTheme } from '@react-navigation/native';
import { FlatList, ScrollView } from "react-native-gesture-handler";

function GastosTransaccion({ navigation }){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { colors } = useTheme();

    const {params: { item },} = useRoute();

    const [isFocusedobs, setIsFocusedobs] = useState(false);
    const [isFocusedgasto, setIsFocusedgasto] = useState(false);
    const [estadomodal,setEstadomodal]=useState(false)
    const [datamodal,setDatamodal]=useState([])
    
    
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [mesprincipal,setMesprincipal]=useState(0)
    const [annoprincipal,setAnnoprincipal]=useState(0)
    const [listacategorias,setListacategorias]=useState([])
    const [listagastos,setListagastos]=useState([])
    const [codigoregistro,setCodigoregisto]=useState(0)
    const [optionscategoria, setOptionscategoria] = useState([]);
    const[categoriasel,setCategoriasel]=useState(0)
    const [selectedOptioncategoria, setSelectedOptioncategoria] = useState(null);
    const [optionsgasto, setOptionsgasto] = useState([]);
    const [selectedOptiongasto, setSelectedOptiongasto] = useState(null);
    const[gasttosel,setGastosel]=useState(0)
    const[monto,setMonto]=useState('')
    const[anotacion,setAnotacion]=useState('')
    const [fechaegreso, setFechaegreso] = useState('');
    const [titulomodal,setTitulomodal]=useState('')
    const [realizado,setRealizado]=useState(false)
    const [focus, setFocus] = useState(false)

    const toggleModal = () => {
        setEstadomodal(!estadomodal);
        console.log(optionscategoria)
        setDatamodal(optionscategoria)
      };

    
    const handleGoBack = () => {
        navigation.goBack();
      };
    const SeleccionCategoria = (value) => {
        setSelectedOptioncategoria(value);
        setCategoriasel(value)
        const lista_gastos_categoria = listagastos.filter((pro) => pro.categoria === value)

        setOptionsgasto(lista_gastos_categoria.map(item => ({
            label: item.nombre_gasto,
            value: item.id
          })));
        
      };
    const SeleccionGasto = (value) => {
        setSelectedOptiongasto(value);
        setGastosel(value)
        
      };

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
        // console.warn("Fecha Formateada: ", fechaFormateada);
        setFechaegreso(fechaFormateada)
        hideDatePicker();
      };

    const registrar_egreso = async () => {
        
        const datosregistrar = {
            codgasto:codigoregistro,
            gasto:gasttosel,
            monto:parseInt(monto,10),
            fecha:fechaegreso,
            anotacion:anotacion,
            

        };
        
        const endpoint='RegistroEgreso/'
        const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
        
        const respuesta=result['resp']
        if (respuesta === 200) {
          
          item.recarga='si'
      
  
          navigation.goBack();
          
        } else if(respuesta === 403 || respuesta === 401){

          await Handelstorage('borrar')
          await new Promise(resolve => setTimeout(resolve, 1000))
          setActivarsesion(false)
        }
        // setRecargadatos(!recargadatos)

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
            const datestorage=await Handelstorage('obtenerdate');
            const mes_storage=datestorage['datames']
            const anno_storage=datestorage['dataanno']
            setMesprincipal(mes_storage)
            setAnnoprincipal(anno_storage)
            const body = {};
            const endpoint='MisDatosRegistroEgreso/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            const respuesta=result['resp']
            if (respuesta === 200){
              
                setOptionscategoria(result['data']['datoscategorias'].map(a => ({
                  opcion: a.nombre_categoria,
                  id: a.id
                })));

              
                setListagastos(result['data']['datosgastos'])
                setCodigoregisto(item.id)
                if(item.id===0){
                  //setTitulomodal('Nuevo Registro')

                }else{
                  const listadocategorias = result['data']['datosgastos']
                  //setTitulomodal('Modificar Registro')
                  setSelectedOptioncategoria(item.CodigoCategoriaGasto);
                  setCategoriasel(item.CodigoCategoriaGasto)

                  const lista_gastos_categoria = listadocategorias.filter((pro) => pro.categoria === item.CodigoCategoriaGasto)
                  

                  setOptionsgasto(lista_gastos_categoria.map(a => ({
                      label: a.nombre_gasto,
                      value: a.id
                    })));

                  setSelectedOptiongasto(item.gasto);
                  setGastosel(item.gasto)

                  setMonto(item.monto_gasto)
                  setFechaegreso(item.fecha_gasto)
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
            <View style={{flex: 1,justifyContent:'center'}}>
                  
                  
                  <ScrollView style={{padding:10,
                                maxHeight:350,
                                marginLeft:10,
                                marginRight:10
                                
                                
                                }}>
                      
                      {/* <RNPickerSelect
                              onValueChange={SeleccionCategoria}
                              items={optionscategoria}
                              useNativeAndroidPickerStyle={false}
                              value={selectedOptioncategoria}
                              placeholder={{ label: 'Categoria', value: null }}
                              // Icon={}
                              style={pickerSelectStyles}
                              Icon={() => {
                                return <AntDesign style={{marginRight:5,marginTop:5}} name="downcircle" size={27} color="gray" />;
                              }}
                              pickerProps={{
                                
                                mode: 'dropdown', // Establece el modo del modal (dropdown o modal)
                                animationType: 'slide', // Tipo de animación al abrir/cerrar el modal
                                
                                // Más props aquí...
                              }}
                                      
                            /> */}
                      <View style={{ flexDirection: 'row', alignItems:'stretch' }}>
                          
                          <Text style={[styles.inputtextactivo, 
                                        { width:'50%',
                                          color: fechaegreso ? colors.text : 'gray',
                                          borderBottomColor: fechaegreso ? colors.textbordercoloractive : colors.textbordercolorinactive}]} 
                            onPress={showDatePicker} >
                            {fechaegreso ? moment(fechaegreso).format('DD/MM/YYYY') : 'Categoria..'}
                            
                            </Text>
        
                          <TouchableOpacity 
                            style={styles.botonfecha} 
                            onPress={toggleModal}>         
                              <FontAwesome name="search-plus" size={30} color={colors.iconcolor} />
                          </TouchableOpacity>
        
                          
        
                      </View>
                      <RNPickerSelect
                              onValueChange={SeleccionGasto}
                              items={optionsgasto}
                              value={selectedOptiongasto}
                              useNativeAndroidPickerStyle={false}
                              placeholder={{ label: 'Gasto', value: null }}
                              style={pickerSelectStyles}
                              Icon={() => {
                                return <AntDesign style={{marginRight:5,marginTop:5}} name="downcircle" size={27} color="gray" />;
                              }}
                              pickerProps={{
                                
                                mode: 'dropdown', // Establece el modo del modal (dropdown o modal)
                                animationType: 'slide', // Tipo de animación al abrir/cerrar el modal
                                
                                // Más props aquí...
                              }}
                            />
                      <TextInputMask
                                  style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, borderBottomColor: isFocusedgasto ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
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
                                  placeholder="Monto Gasto"
                                  placeholderTextColor='gray'
                                />

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
                      <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, borderBottomColor: isFocusedobs ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
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
                        onPress={registrar_egreso}>
                        REGISTRAR 
                  </Button>

                  
                    <Modal
                    visible={estadomodal}
                    transparent={true}
                    onRequestClose={toggleModal}
                    >
                        <TouchableOpacity
                            style={styles.overlay}
                            activeOpacity={1}
                            onPress={toggleModal}
                            />
                        <View style={styles.modalContainer}>
                        <Text>Contenido del modal</Text>
                        <TextInput placeholder="Buscar.." placeholderTextColor={'red'}> </TextInput>
                        
                        <FlatList
                        data={datamodal}
                        renderItem={({item}) =>{
                            return(
                                
                                    <View>
                                        <Text style={{color:'black'}}>  {item.opcion}</Text>
                                    </View>
                                
                                
                            )
                        }
                    }
                        keyExtractor={item => item.id}

                        />
                            

                        
                        <TouchableOpacity onPress={toggleModal}>
                            <Text style={{ color: 'blue', marginTop: 10 }}>Cerrar modal</Text>
                        </TouchableOpacity>
                        </View>
                    </Modal>
                
               

            </View>
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
    backgroundColor: 'white',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height:'50%',
    borderTopLeftRadius:50,
    borderTopRightRadius:50
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
      // backgroundColor: 'blue',
      width: 50, // Define el ancho del botón
      height: 35, // Define la altura del botón
      //borderRadius: 5, // Define la mitad de la dimensión del botón para obtener una forma circular
      // borderWidth:1,
      // borderColor:'black',
      // justifyContent: 'center', // Alinea el contenido (icono) verticalmente en el centro
      // alignItems: 'center', // Alinea el contenido (icono) horizontalmente en el centro
      marginLeft:'5%',
      marginBottom:27
    },
    botoncomando:{
      backgroundColor: 'blue',
      width: 50, // Define el ancho del botón
      height: 40, // Define la altura del botón
      borderRadius: 5, // Define la mitad de la dimensión del botón para obtener una forma circular
      justifyContent: 'center', // Alinea el contenido (icono) verticalmente en el centro
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

export default GastosTransaccion