import React,{useState,useEffect,useContext} from "react";
import { View, Text, Pressable, Image,StyleSheet } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { Button} from 'react-native-paper';

import Handelstorage from "../../Storage/handelstorage";
import { AuthContext } from "../../AuthContext";

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

function DrawerContentInicio(props){

    const { activarsesion, setActivarsesion } = useContext(AuthContext);

    const cerrar=async ()=>{
        await Handelstorage('borrar')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setActivarsesion(false)
      }
    return(
        <View style={{flex: 1}} >
            <DrawerContentScrollView {...props} scrollEnabled={false}>
            <View style={styles.containerimagen}>
                <Image
                        source={require('../../assets/ahorro6.png')} // Ruta de la imagen
                        style={styles.image}
                        resizeMode="cover" // La imagen se ajusta al tamaño del contenedor sin distorsión
                    />
                </View>
                <DrawerItemList {...props} />
                


            </DrawerContentScrollView>

            <Button 
                        style={{marginBottom:10,width:250,height:50,
                          backgroundColor:'rgba(44,148,228,0.3)'
                        }} 
                     
                        icon={() => {
                          

                          return <Entypo name="log-out" size={30} color="white" />
                        }}
                        mode="elevated" 
                        textColor="white"
                        onPress={cerrar}>
                        CERRAR SESION 
                  </Button>

            {/* <Pressable onPress={closeDrawer} style={{padding: 20}}>

                <Text style={{color:'white'}}>Logout</Text>
            </Pressable> */}
    </View>
    )
}

const styles = StyleSheet.create({
    
    
  
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

    
  });

export default DrawerContentInicio