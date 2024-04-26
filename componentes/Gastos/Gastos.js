import React,{useState,useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import {  View,Text, StyleSheet,FlatList,TouchableOpacity,SafeAreaView,Animated   } from "react-native";
import { Modal, Portal,  PaperProvider,Dialog,Button } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';

import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import GastoModal from "./GastoModal";


function Gastos (){
    const [recargadatos,setRecargadatos]=useState(false)
    const [cargacompleta,setCargacopleta]=useState(false)
    const [dataegresos,setDataegresos]=useState([])
    const [rotationValue] = useState(new Animated.Value(0));
    const [rotationValueedit] = useState(new Animated.Value(0));
    const [rotationValuedel] = useState(new Animated.Value(0));
    const { navigate } = useNavigation();
    const [visible, setVisible] = useState(false);
    const [visibledialogo, setVisibledialogo] = useState(false)

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const showDialog = () => setVisibledialogo(true);
    const hideDialog = () => setVisibledialogo(false);

    const containerStyle = {backgroundColor: 'white', padding: 20};
    const [montototalegreso,setMontototalegreso]=useState(0)
    const [canttotalegreso,setcanttotalegreso]=useState(0)
    const [registrosel,setRegistrosel]=useState([])
    const [codigoeliminar,setCodigoelimnar]=useState('')
    const [conceptoeliminar,setConceptoelimnar]=useState('')
   
    const handlePress = () => {
        // Realiza una animación de rotación cuando se presiona el botón
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 200, // Duración de la animación en milisegundos
          useNativeDriver: true,
        }).start(() => {
          // Restaura la animación a su estado original
          rotationValue.setValue(0);
        });
        setRegistrosel({id:0})
        setVisible(true)
        // Ejecuta la función onPressBoton si se proporciona
        // onPressBoton && onPressBoton();
      };
    
      // Interpola el valor de rotación para aplicarlo al estilo de transformación del icono
    const spin = rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      } 
    );

    const editar=(item)=>{
        // Realiza una animación de rotación cuando se presiona el botón
        setRegistrosel(item)
        
        setVisible(true)
        Animated.timing(rotationValueedit, {
            toValue: 1,
            duration: 200, // Duración de la animación en milisegundos
            useNativeDriver: true,
          }).start(() => {
            // Restaura la animación a su estado original
            rotationValueedit.setValue(0);
          });
    }
    const spinedit = rotationValueedit.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      } 
    );

    const eliminar=(item)=>{
        // Realiza una animación de rotación cuando se presiona el botón
        const valdel=[item.id]
        
        setCodigoelimnar(valdel)
        setConceptoelimnar(item.NombreGasto)
        showDialog(true)
        Animated.timing(rotationValuedel, {
            toValue: 1,
            duration: 200, // Duración de la animación en milisegundos
            useNativeDriver: true,
          }).start(() => {
            // Restaura la animación a su estado original
            rotationValuedel.setValue(0);
          });
    }
    const confimareliminacion = async()=>{
      
      const datoseliminar = {
        gastos:codigoeliminar,};
  
  
      const endpoint='EliminarEgreso/'
      const result = await Generarpeticion(endpoint, 'POST', datoseliminar);
        
      const respuesta=result['resp']
      if (respuesta === 200) {
        hideDialog()
        setRecargadatos(!recargadatos)
          
      } else if(respuesta === 403 || respuesta === 401){
        
        console.log(respuesta)
  
    }

    }
    const spindel = rotationValuedel.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      } 
    );

    useEffect(() => {

        const cargardatos=async()=>{
            const datestorage=await Handelstorage('obtenerdate');
            const mes_storage=datestorage['datames']
            const anno_storage=datestorage['dataanno']
            const body = {};
            const endpoint='MovileMisEgresos/' + anno_storage +'/' + mes_storage + '/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            const respuesta=result['resp']
            if (respuesta === 200){
                const registros=result['data']
                
                if(Object.keys(registros).length>0){
                    registros.forEach((elemento) => {
                      
                      elemento.key = elemento.id;
                    })
                    
                    setDataegresos(registros)
                    let totalgasto=0
                    let cantgasto=0
                    registros.forEach(({ monto_gasto }) => {totalgasto += monto_gasto,cantgasto+=1})
                    setMontototalegreso(totalgasto)
                    setcanttotalegreso(cantgasto)
                }
                
            }else{
                console.log(respuesta)
            }
            setCargacopleta(true)

           
        }
        cargardatos()
      }, [recargadatos]);
    if(cargacompleta){

        return(
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar />

                <PaperProvider>
                    <Portal>
                        
                      {visible&&(<GastoModal visible={visible} setVisible={setVisible} 
                                    recargadatos={recargadatos} setRecargadatos={setRecargadatos}  
                                    registrosel={registrosel}
                                    >

                                    </GastoModal>)}


                      <Dialog visible={visibledialogo} onDismiss={hideDialog}>
                        <Dialog.Title>Eliminar Registro</Dialog.Title>
                        <Dialog.Content>
                          <Text variant="bodyMedium">{`¿Desea eliminar el registro de ${conceptoeliminar} con ID operacion N°: ${codigoeliminar}?`}</Text>
                           
                        </Dialog.Content>
                        <Dialog.Actions>
                          <Button onPress={hideDialog}>Cancelar</Button>
                          <Button onPress={confimareliminacion}>ELIMINAR</Button>
                        </Dialog.Actions>
                      </Dialog>


                      
                    </Portal>
                    <View style={styles.cabeceracontainer}>
                        <Text style={styles.titulocabecera}>Registro Gastos</Text>
                        <TouchableOpacity style={styles.botoncabecera} onPress={handlePress}>
                            <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                <FontAwesome6 name="add" size={24} color="black" />
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                    <View  style={styles.container}>
                        <FlatList  onPress={() => console.log('FlatList')}
                            data={dataegresos}
                            renderItem={({item}) =>{
                                return(
                                    <TouchableOpacity  style={styles.contenedordatos}  onPress={() => {navigate("GastosDetalle", { item});}}
                                    >
                                        <View style={[styles.columna, { flex: 7 }]}> 

                                            <Text style={styles.textocontenido}> Concepto: {item.NombreGasto}</Text>
                                            <Text style={styles.textocontenido}> Fecha Gasto: {moment(item.fecha_gasto).format('DD/MM/YYYY')}</Text>
                                            {/* <Text> Total: {item.monto_gasto}</Text> */}
                                            <Text style={styles.textocontenido}> Total: {Number(item.monto_gasto).toLocaleString('es-ES')} Gs.</Text>
                                            <Text style={styles.textocontenido}> Fecha Registro: {moment(item.fecha_registro).format('DD/MM/YYYY HH:mm:ss')}</Text>
                                        </View>

                                        <View style={[styles.columna, { flex: 1 }]}> 

                                            {/* <IconButton icon="delete-circle-outline"size={20}mode="contained"onPress={() => console.log('Pressed')}/> */}
                                            <TouchableOpacity style={[styles.botonaccion, { marginBottom:10}]} onPress={() => eliminar(item)}>
                                                <Animated.View style={{ transform: [{ rotate: spindel }] }}>
                                                    <AntDesign name="delete" size={30} color="red" />
                                                </Animated.View>
                                            </TouchableOpacity>

                                            {/* <IconButton icon='pencil-circle-outline'size={20} mode="contained"onPress={() => console.log('Pressed')}/> */}
                                            <TouchableOpacity style={[styles.botonaccion]} onPress={() => editar(item)}>
                                                <Animated.View style={{ transform: [{ rotate: spinedit }] }}>
                                                    <AntDesign name="edit" size={30} color="black" />
                                                </Animated.View>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity >
                                )
                            }
                        }
                            keyExtractor={item => item.key}
                        />
                        
                    </View>

                    <View style={styles.resumencontainer}>

                        {/* <Text style={styles.Tituloresumen}>RESUMEN</Text> */}
                        <Text style={styles.contenedortexto}>
                          <Text style={styles.labeltext}>Cantidad Registros:</Text>{' '}
                            {Number(canttotalegreso).toLocaleString('es-ES')}
                        </Text>
                        <Text style={styles.contenedortexto}>
                          <Text style={styles.labeltext}>Total Gasto:</Text>{' '}
                            {Number(montototalegreso).toLocaleString('es-ES')} Gs.
                        </Text>
                        
                    </View>
                </PaperProvider>
            </SafeAreaView>
    
            
        )
    }




    
}
const styles = StyleSheet.create({
    
    cabeceracontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
        
      },
    titulocabecera: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
      },
    textocontenido:{
      fontSize:12.5,
      marginBottom:5
    },

    botoncabecera: {
        backgroundColor: 'blue',
        width: 40, // Define el ancho del botón
        height: 40, // Define la altura del botón
        borderRadius: 20, // Define la mitad de la dimensión del botón para obtener una forma circular
        justifyContent: 'center', // Alinea el contenido (icono) verticalmente en el centro
        alignItems: 'center', // Alinea el contenido (icono) horizontalmente en el centro
      },

    botonaccion: {
        
        width: 40, // Define el ancho del botón
        height: 40  , // Define la altura del botón
        borderRadius: 5, // Define la mitad de la dimensión del botón para obtener una forma circular
        justifyContent: 'center', // Alinea el contenido (icono) verticalmente en el centro
        alignItems: 'center', // Alinea el contenido (icono) horizontalmente en el centro
        
      },
  textoBoton: {
        color: 'white',
        fontWeight: 'bold',
      },
    
  container: {
        flex: 1,
      },
  contenedordatos:{
        flexDirection: 'row',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        overflow: 'hidden', 
        height: 110,
        padding: 10,
        margin:5,
        
    },
  columnadatos:{
        flex: 1,
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
  resumencontainer: {
      //flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderWidth:0.5,
      borderTopRightRadius:50,
      borderColor:'gray',
      backgroundColor:'white',
      paddingLeft:30

      
    },
  contenedortexto:{
      paddingBottom:10,
      fontSize:15
    },
  labeltext:{
      fontWeight:'bold',
      fontSize:15
  },
  Tituloresumen: {
    
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom:5
  },

  });
export default Gastos