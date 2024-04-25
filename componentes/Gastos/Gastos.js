import React,{useState,useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import {  View,Text, StyleSheet,FlatList,TouchableOpacity,SafeAreaView,Animated   } from "react-native";
import { Modal, Portal,  PaperProvider } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import moment from 'moment';

import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import GastoModal from "./GastoModal";


function Gastos (){
    const [cargacompleta,setCargacopleta]=useState(false)
    const [dataegresos,setDataegresos]=useState([])
    const [rotationValue] = useState(new Animated.Value(0));
    const { navigate } = useNavigation();
    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: 'white', padding: 20};
   
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
                    // console.log(registros)
                    setDataegresos(registros)
                }
                
            }else{
                console.log(respuesta)
            }
            setCargacopleta(true)

           
        }
        cargardatos()
      }, []);
    if(cargacompleta){

        return(
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar />

                <PaperProvider>
                    <Portal>
                        {/* <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                        <Text>Example Modal.  Click outside this area to dismiss.</Text>
                        </Modal> */}
                      {visible&&(<GastoModal visible={visible} setVisible={setVisible}></GastoModal>)}  
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

                                            <Text> Concepto: {item.NombreGasto}</Text>
                                            <Text> Fecha Gasto: {moment(item.fecha_gasto).format('DD/MM/YYYY')}</Text>
                                            {/* <Text> Total: {item.monto_gasto}</Text> */}
                                            <Text> Total: {Number(item.monto_gasto).toLocaleString('es-ES')} Gs.</Text>
                                            <Text> Fecha Registro: {moment(item.fecha_registro).format('DD/MM/YYYY HH:mm:ss')}</Text>
                                        </View>

                                        <View style={[styles.columna, { flex: 1 }]}> 
                                            <IconButton icon="delete-circle-outline"size={20}mode="contained"onPress={() => console.log('Pressed')}/>
                                            <IconButton icon='pencil-circle-outline'size={20} mode="contained"onPress={() => console.log('Pressed')}/>
                                        </View>
                                    </TouchableOpacity >
                                )
                            }
                        }
                            keyExtractor={item => item.key}
                        />
                        
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
    botoncabecera: {
        backgroundColor: 'blue',
        width: 40, // Define el ancho del botón
        height: 40, // Define la altura del botón
        borderRadius: 20, // Define la mitad de la dimensión del botón para obtener una forma circular
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
        margin:5
    },
    columnadatos:{
        flex: 1,
        height: '100%',
        backgroundColor: '#f0f0f0',
    }
  });
export default Gastos