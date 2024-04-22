import React,{useState,useEffect} from "react";

import {  View,Text, StyleSheet,FlatList, SafeAreaView } from "react-native";
import { IconButton } from 'react-native-paper';

import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import ModalIngreso from "./modalingresos";

function Ingresos (){

    const [cargacompleta,setCargacopleta]=useState(false)
    const [dataingresos,setDataingresos]=useState([])
    const [openmodal,setOpenModal]=useState(false)
    const abrirmodal=()=>{
        setOpenModal(true)
    }
    useEffect(() => {

        const cargardatos=async()=>{
            const datestorage=await Handelstorage('obtenerdate');
            const mes_storage=datestorage['datames']
            const anno_storage=datestorage['dataanno']
            const body = {};
            const endpoint='MovileMisIngresos/' + anno_storage +'/' + mes_storage + '/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            const respuesta=result['resp']
            if (respuesta === 200){
                const registros=result['data']
                
                if(Object.keys(registros).length>0){
                    registros.forEach((elemento) => {
                      
                      elemento.key = elemento.id;
                    })
                    // console.log(registros)
                    setDataingresos(registros)
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

                <View  style={styles.container}>
                    <FlatList
                        data={dataingresos}
                        renderItem={({item}) =>{
                            return(
                                <View style={styles.contenedordatos}>
                                    <View style={[styles.columna, { flex: 4 }]}> 

                                        <Text> Descripcion: {item.NombreIngreso}</Text>
                                        <Text> Fecha Ingreso: {item.fecha_ingreso}</Text>
                                        <Text> Total: {item.monto_ingreso}</Text>
                                        <Text> Fecha Registro: {item.fecha_registro}</Text>
                                    </View>

                                    <View style={[styles.columna, { flex: 1 }]}> 
                                        <IconButton icon="delete-circle-outline"size={20}mode="contained"onPress={() => console.log('Pressed')}/>
                                        <IconButton icon='pencil-circle-outline'size={20} mode="contained"onPress={() => console.log('Pressed')}/>
                                    </View>
                                </View>
                            )
                        }
                    }
                        keyExtractor={item => item.key}
                    />
                    <View style={styles.fixedButtonsContainer}>
                        <IconButton icon="plus-circle-outline"size={30}mode="contained" onPress={abrirmodal}/>
                    </View>
                    {openmodal &&(<ModalIngreso></ModalIngreso>)}
                </View>
            </SafeAreaView>
    
            
        )
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      // Agrega estilos adicionales según sea necesario
    },
    fixedButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 16,
      backgroundColor: '#fff', // Puedes cambiar el color de fondo si es necesario
      borderTopWidth: 1,
      borderTopColor: '#ccc', // Puedes cambiar el color de la línea superior
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

export default Ingresos