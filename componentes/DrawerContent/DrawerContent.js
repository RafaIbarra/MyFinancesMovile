import React,{useState,useEffect} from "react";
import { StyleSheet,Button,View,Image,TouchableOpacity,Text  } from "react-native";
import { Divider } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import Handelstorage from "../../Storage/handelstorage";
import { Feather } from '@expo/vector-icons'; // Importa un icono de Feather
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
const sizeicon=30
function DrawerContent({setActivarsesion,navigation} ){

    const navigateToHome = () => {
        navigation.navigate('Home');
      };
  
      const navigateToConceptosGastos = () => {
        navigation.navigate('ConceptosGastos');
      };
      const cerrar=async ()=>{
        await Handelstorage('borrar')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setActivarsesion(false)
      }
      return (
        <View  style={styles.drawerContent}>
            <View style={styles.containercabecera}>

                <View style={styles.containerimagen}>
                <Image
                        source={require('../../assets/ahorro6.png')} // Ruta de la imagen
                        style={styles.image}
                        resizeMode="cover" // La imagen se ajusta al tamaño del contenedor sin distorsión
                    />
                </View>
            </View>
            {/* <Divider color='red' size={5}/> */}
            
            <View style={styles.contenedoracciones}> 

                <TouchableOpacity style={styles.button} onPress={navigateToHome}>
                    <AntDesign name="home" size={sizeicon} color="black" />
                    <Text style={styles.text}> Inicio  </Text>
                </TouchableOpacity>
                <Divider />

                <TouchableOpacity style={styles.button} onPress={navigateToHome}>
                <Feather name="trending-up" size={sizeicon} color="black" />
                    <Text style={styles.text}> Conceptos Ingresos  </Text>
                </TouchableOpacity>
                <Divider />

                <TouchableOpacity style={styles.button} onPress={navigateToHome}>
                    <Feather name="align-left" size={sizeicon} color="black" />
                    <Text style={styles.text}> Categoria Gastos  </Text>
                </TouchableOpacity>
                <Divider />

                <TouchableOpacity style={styles.button} onPress={navigateToConceptosGastos}>
                    <Feather name="trending-down" size={sizeicon} color="black" />
                    <Text style={styles.text}> Conceptos Gastos  </Text>
                </TouchableOpacity>
                <Divider />

                <TouchableOpacity style={styles.button} onPress={navigateToHome}>
                    <AntDesign name="home" size={sizeicon} color="black" />
                    <Text style={styles.text}> Historico Movimientos  </Text>
                </TouchableOpacity>
                <Divider />

                <TouchableOpacity style={styles.button} onPress={navigateToHome}>
                    <AntDesign name="barschart" size={sizeicon} color="black" />  
                    <Text style={styles.text}> Estadisticas  </Text>
                </TouchableOpacity>
                <Divider />

                <TouchableOpacity style={styles.button} onPress={navigateToHome}>
                    <Ionicons name="person-outline" size={sizeicon} color="black" />  
                    <Text style={styles.text}> Datos Personales  </Text>
                </TouchableOpacity>
                <Divider />

                <TouchableOpacity style={styles.button} onPress={navigateToHome}>
                    <AntDesign name="setting" size={sizeicon} color="black" />
                    <Text style={styles.text}> Configuracion  </Text>
                </TouchableOpacity>
                {/* <DropDownPicker
                    items={[
                    { label: 'Opción 1', value: 'opcion1' },
                    { label: 'Opción 2', value: 'opcion2' },
                    { label: 'Opción 3', value: 'opcion3' },
                    ]}
                    defaultValue={'opcion1'}
                    containerStyle={{ height: 40, width: 150 }}
                    onChangeItem={(item) => console.log(item.value)}
                /> */}
                <Divider />
            </View>

            <TouchableOpacity style={styles.buttonclose} onPress={cerrar}>
                <Entypo name="log-out" size={sizeicon} color="white" />
                <Text style={styles.textclose}> Cerrar Sesion  </Text>
            </TouchableOpacity>
            <Divider />


            {/* <Button title="Home" onPress={navigateToHome} />
            <Button title="Conceptos Gastos" onPress={navigateToConceptosGastos} />
            <Button title="Cerrar Sesion" onPress={cerrar} />
            <Button title="Boton de prueba" onPress={navigateToHome} /> */}
        </View>
      );

}

const styles = StyleSheet.create({
    
    drawerContent: {
      flex: 1, // Esto asegura que DrawerContent ocupe solo el espacio necesario
      paddingTop: 10, // Espacio en la parte superior para evitar solapamiento con el header del drawer
      
      height:10
    },
    containercabecera:{
    borderBottomWidth:1,
    borderColor:'#e9e9e9',
    paddingBottom:10

    }
    ,
    containerimagen: {
        width: 100, // Ancho del contenedor
        height: 100, // Altura del contenedor
        borderRadius: 75, // Hace que el borde sea circular (la mitad del ancho y la altura)
        borderWidth:2,
        borderColor:'gray',
        overflow: 'hidden', // Oculta el contenido que se desborda del contenedor circular
        marginLeft:'33%',
        marginBottom:3,
      },
    image: {
        width: '100%', // La imagen ocupa todo el ancho del contenedor
        height: '100%', // La imagen ocupa todo el alto del contenedor
        
      },

    button: {
        // backgroundColor: 'blue', // Color de fondo del botón
        borderRadius: 20, // Bordes curvos
        padding: 10, // Espaciado interno
        flexDirection: 'row', // Alinea los elementos horizontalmente
        alignItems: 'center', // Centra verticalmente los elementos
      },

      buttonclose: {
        backgroundColor: 'black', // Color de fondo del botón
        marginTop:'70%',
        borderRadius: 10, // Bordes curvos
        padding: 10, // Espaciado interno
        flexDirection: 'row', // Alinea los elementos horizontalmente
        alignItems: 'center', // Centra verticalmente los elementos
      },

    text: {
        color: 'black', // Color del texto
        marginLeft: 20, // Espacio entre el icono y el texto
        fontSize:15
      },

    textclose: {
        color: 'white', // Color del texto
        marginLeft: 20, // Espacio entre el icono y el texto
        fontSize:20
      },
    contenedoracciones:{
        marginTop:'10%',
        // backgroundColor:'red'
    }
  });
export default DrawerContent
