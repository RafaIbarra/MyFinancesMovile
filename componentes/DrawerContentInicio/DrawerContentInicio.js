import React,{useEffect,useContext} from "react";
import { View, Text,  Image,StyleSheet } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { Button} from 'react-native-paper';

import Handelstorage from "../../Storage/handelstorage";
import { AuthContext } from "../../AuthContext";

import { useTheme } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

function DrawerContentInicio(props){

    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const {sesiondata, setSesiondata} = useContext(AuthContext);
    const { colors } = useTheme();
    const cerrar=async ()=>{
        await Handelstorage('borrar')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setActivarsesion(false)
      }
      useEffect(() => {

        const cargardatos=()=>{

            
           
        }
        cargardatos()
      }, []);
    return(
        <View style={{flex: 1}} >
            <DrawerContentScrollView {...props} scrollEnabled={false}>
                <View style={{flex:1,flexDirection:'row',borderBottomWidth:1,borderBottomColor:colors.bordercolor,paddingBottom:10}}>

                  <View style={styles.containerimagen}>
                    <Image
                          source={require('../../assets/ahorro6.png')} // Ruta de la imagen
                          style={styles.image}
                          resizeMode="cover" // La imagen se ajusta al tamaño del contenedor sin distorsión
                      />
                  </View>
                  
                  <View style={{marginTop:15,marginLeft:20,alignItems:'flex-start',alignContent:'flex-start',justifyContent:'space-between'}}>
                    <Text style={[ styles.textouser, { color: colors.text}]}>
                        @{sesiondata[0].username}
                      </Text>
                      <Text style={[ styles.textodatos, {color: colors.text}]}>
                        {sesiondata[0].nombre}
                      </Text>

                      <Text style={[ styles.textodatos, {color: colors.text}]}>
                        {sesiondata[0].apellido}
                      </Text>

                      <Text style={[ styles.textodatos, {color: colors.text}]}>
                        {sesiondata[0].fecha_registro}
                      </Text>

                  </View>
                </View>
                
                <DrawerItemList {...props} />
                


            </DrawerContentScrollView>

            <Button 
                    style={{marginBottom:20,marginLeft:10,width:'90%',height:40,
                      //backgroundColor:'rgb(44,148,228)',
                      backgroundColor:'rgba(218,165,32,0.7)',
                      alignContent:'center',alignItems:'center',justifyContent:'center'
                    }} 
                  
                    icon={() => {return <Entypo name="log-out" size={30} color="white" />}}
                    mode="elevated" 
                    textColor="white"
                    onPress={cerrar}>
                        CERRAR SESION 
                </Button>

    </View>
    )
}

const styles = StyleSheet.create({
    
    
  
    containerimagen: {
        width: 80, // Ancho del contenedor
        height: 80, // Altura del contenedor
        borderRadius: 75, // Hace que el borde sea circular (la mitad del ancho y la altura)
        borderWidth:2,
        borderColor:'gray',
        overflow: 'hidden', // Oculta el contenido que se desborda del contenedor circular
        marginLeft:10,
        marginTop:10,
        marginBottom:3,
      },
    image: {
        width: '100%', // La imagen ocupa todo el ancho del contenedor
        height: '100%', // La imagen ocupa todo el alto del contenedor
        
      },
    textodatos:{
      fontSize:10
    },
    textouser:{
      fontSize:17,
      fontWeight:'bold',
      fontStyle:'italic'
    }

    
  });

export default DrawerContentInicio