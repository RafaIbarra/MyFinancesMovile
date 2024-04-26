import React,{useState,useEffect} from "react";
import { Modal, Portal,  PaperProvider,Text,Divider } from 'react-native-paper';
import {  StyleSheet,Button,View,TouchableOpacity,TextInput } from "react-native";
import { TextInputMask } from 'react-native-masked-text';
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

import { AntDesign } from '@expo/vector-icons'

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
                
            }else{
                console.log(respuesta)
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
          
          console.log('error')

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
                <Text style={{fontSize:22, fontWeight:'bold' }}>{titulomodal}</Text>
                <Divider />
    
                <View style={{padding:15}}>
    
                    
    
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
                    
                      <Text style={[styles.input, { width:'80%'}]}>
                        {fechaegreso ? moment(fechaegreso).format('DD/MM/YYYY') : 'Fecha Gasto'}
                        </Text>
    
                      <TouchableOpacity style={styles.botonfecha} onPress={showDatePicker}>         
                          <AntDesign name="calendar" size={24} color="white" />
                      </TouchableOpacity>
    
                      <DateTimePickerModal
                          
                          isVisible={isDatePickerVisible}
                          mode="date"
                          onConfirm={handleConfirm}
                          onCancel={hideDatePicker}
                      />
    
                    </View>
    
                    
                    <TextInput style={styles.input}
                            placeholder='Observacion' 
                            value={anotacion}
                            onChangeText={anotacion => setAnotacion(anotacion)}/>
    
                              
                </View>
                <Divider />
                <Divider />
                <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:'15%',marginTop:15}}>
    
                  <TouchableOpacity style={styles.botoncomando} onPress={cerrar}>         
                      <AntDesign name="closecircleo" size={30} color="white" />
                  </TouchableOpacity>
    
                  <TouchableOpacity style={styles.botoncomando} onPress={registrar_egreso}>         
                        <AntDesign name="save" size={30} color="white" />
                  </TouchableOpacity>
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
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      backgroundColor:'rgba(128, 128, 128,0.3)',
      borderRadius: 5,
      padding: 5,
      fontSize: 12.5,
      height: 30,
      marginBottom:15
    },
    botonfecha:{
      backgroundColor: 'blue',
      width: 40, // Define el ancho del botón
      height: 30, // Define la altura del botón
      borderRadius: 5, // Define la mitad de la dimensión del botón para obtener una forma circular
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