import React,{useState,useEffect} from "react";

import { Modal, Portal,  PaperProvider,Text,Divider } from 'react-native-paper';
import {  StyleSheet,View,TouchableOpacity,TextInput } from "react-native";
import { Button } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text';
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

import { AntDesign } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

function GastoModal({visible,setVisible,recargadatos,setRecargadatos,registrosel}){
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [mesprincipal,setMesprincipal]=useState(0)
    const [annoprincipal,setAnnoprincipal]=useState(0)
    const [listacategorias,setListacategorias]=useState([])
    const [listagastos,setListagastos]=useState([])
    const [codigoregistro,setCodigoregisto]=useState(0)
    const [optionscategoria, setOptionscategoria] = useState([]);
    const [selectedOptioncategoria, setSelectedOptioncategoria] = useState(null);

    const [optionsgasto, setOptionsgasto] = useState([]);
    const [selectedOptiongasto, setSelectedOptiongasto] = useState(null);

    const[categoriasel,setCategoriasel]=useState(0)
    const[gasttosel,setGastosel]=useState(0)
    const[monto,setMonto]=useState('')
    const[anotacion,setAnotacion]=useState('')
    const [fechaegreso, setFechaegreso] = useState('');
    const [titulomodal,setTitulomodal]=useState('')
    const [realizado,setRealizado]=useState(false)

    const [focus, setFocus] = useState(false)

    const containerStyle = {backgroundColor: 'white', padding: 20,borderRadius:30,width:'90%',marginLeft:'5%'};
    const cerrar=()=>{
        setVisible(false)
    }
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
                
                setOptionscategoria(result['data']['datoscategorias'].map(item => ({
                  label: item.nombre_categoria,
                  value: item.id
                })));

              

                setListagastos(result['data']['datosgastos'])
                setCodigoregisto(registrosel.id)
                if(registrosel.id===0){
                  setTitulomodal('Nuevo Registro')

                }else{
                  const listadocategorias = result['data']['datosgastos']
                  setTitulomodal('Modificar Registro')
                  setSelectedOptioncategoria(registrosel.CodigoCategoriaGasto);
                  setCategoriasel(registrosel.CodigoCategoriaGasto)

                  const lista_gastos_categoria = listadocategorias.filter((pro) => pro.categoria === registrosel.CodigoCategoriaGasto)
                  

                  setOptionsgasto(lista_gastos_categoria.map(item => ({
                      label: item.nombre_gasto,
                      value: item.id
                    })));

                  setSelectedOptiongasto(registrosel.gasto);
                  setGastosel(registrosel.gasto)

                  setMonto(registrosel.monto_gasto)
                  setFechaegreso(registrosel.fecha_gasto)
                  setAnotacion(registrosel.anotacion)
                }
                

                
                setRealizado(true)
                
            }
            

           
        }
        cargardatos()
      }, []);


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
          const registros=result['data']['datos']
          cerrar()
          
        } else if(respuesta === 403 || respuesta === 401){
          
          

        }else {
          
          cpnsole.log(result['data']['error'])
        }
        setRecargadatos(!recargadatos)
     };
     
    const handleTextChange = (formatted, extracted) => {
      const valorformato=formatted.replace(/[,.]/g, '')
      
      setMonto(valorformato);
    };
    
    if(realizado){

        return(
            <Modal visible={visible} onDismiss={cerrar} contentContainerStyle={containerStyle}>
                <Text style={{fontSize:22, fontWeight:'bold',paddingBottom:5 }}>{titulomodal}</Text>
                
    
                <View style={{padding:10,borderTopWidth:1,borderBottomWidth:1,borderColor:'gray'}}>
    
                    
    
                      <RNPickerSelect
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
                                
                      />
    
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
                    
                    
                    
                    {/* <TextInput style={styles.input}
                                placeholder='Monto Gasto' 
                                value={monto} 
                                onChangeText={monto => setMonto(monto)}
                                /> */}
    
                    <TextInputMask
                            style={styles.input}
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
                            
                            keyboardType="numeric"
                            placeholder="Monto Gasto"
                          />
                        
                    
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    
                      <Text style={[styles.input, { width:'80%'}]} onPress={showDatePicker} >
                        {fechaegreso ? moment(fechaegreso).format('DD/MM/YYYY') : 'Fecha Gasto'}
                        
                        </Text>
    
                      <TouchableOpacity style={styles.botonfecha} onPress={showDatePicker}>         
                          <AntDesign name="calendar" size={24} color="black" />
                      </TouchableOpacity>
    
                      <DateTimePickerModal
                          
                          isVisible={isDatePickerVisible}
                          mode="date"
                          onConfirm={handleConfirm}
                          onCancel={hideDatePicker}
                      />
    
                    </View>
    


                    <View style={styles.containertext}>
                      <Text style={[styles.placeholder, focus || anotacion !== '' ? styles.placeholderFocus : null]}>
                        Observación
                      </Text>
                      <TextInput style={styles.input}
                              // placeholder='Observacion' 
                              //label='Obserbacion'
                              value={anotacion}
                              // textAlignVertical="center"
                              onChangeText={anotacion => textoanotacion(anotacion)}
                              onFocus={() => setFocus(true)}
                              onBlur={() => setFocus(anotacion !== '')}
                              />
                    </View>
    
                              
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:'2.5%',marginTop:5}}>
    
                  {/* <TouchableOpacity style={styles.botoncomando} onPress={cerrar}>         
                      <AntDesign name="closecircleo" size={30} color="white" />
                  </TouchableOpacity>
    
                  <TouchableOpacity style={styles.botoncomando} onPress={registrar_egreso}>         
                        <AntDesign name="save" size={30} color="white" />
                  </TouchableOpacity> */}
                  <Button 
                        style={{backgroundColor:'rgb(182, 212, 212)'}} 
                        icon={() => {
                          return <Ionicons name="chevron-back-outline" size={30} color="white" />

                          //return <MaterialCommunityIcons name="content-save-check" size={30} color="white" />
                        }} 
                        mode="elevated" 
                        textColor="white"
                        onPress={cerrar}
                        >CANCELAR 
                  </Button>
                  <Button 
                        style={{marginBottom:5,marginTop:5,marginLeft:10
                           ,backgroundColor:'rgb(182, 212, 212)'
                        }} 
                        // icon="content-save-check" 
                        icon={() => {
                          // return <AntDesign style={{marginRight:5,marginTop:5}} name="downcircle" size={27} color="gray" />;

                          return <MaterialCommunityIcons name="content-save-check" size={30} color="white" />
                        }}
                        mode="elevated" 
                        textColor="white"
                        onPress={registrar_egreso}>REGISTRAR 
                  </Button>
               
                </View>
                
    
                
    
            </Modal>
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
    }
    ,
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
      width: 40, // Define el ancho del botón
      height: 35, // Define la altura del botón
      //borderRadius: 5, // Define la mitad de la dimensión del botón para obtener una forma circular
      borderWidth:1,
      borderColor:'black',
      justifyContent: 'center', // Alinea el contenido (icono) verticalmente en el centro
      alignItems: 'center', // Alinea el contenido (icono) horizontalmente en el centro
      marginLeft:'5%',
      marginBottom:15
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
        color: 'black',
        paddingRight: 30 // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 12.5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom:15,
        height:37,
        
    }
});
export default GastoModal