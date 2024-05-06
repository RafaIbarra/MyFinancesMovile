import React,{useState,useEffect,useContext,useRef } from "react";
import {  View,Text, StyleSheet,Image    } from "react-native";
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import { useTheme } from '@react-navigation/native';
import { AuthContext } from "../../AuthContext";



function Estadisticas ({ navigation  }){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { colors } = useTheme();
    const [cargacompleta,setCargacopleta]=useState(false)
    const [imgresumen,setImgresumen]=useState([])
    const [imgingreso,setImgingreso]=useState([])
    const [imgegreso,setImgegreso]=useState([])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          
          const cargardatos=async()=>{
              const datestorage=await Handelstorage('obtenerdate');
              const mes_storage=datestorage['datames']
              const anno_storage=datestorage['dataanno']

              const body = {};
              const endpoint='EstadisticasMes/' + anno_storage +'/' + mes_storage + '/'
              const result = await Generarpeticion(endpoint, 'POST', body);
              const respuesta=result['resp']
              if (respuesta === 200){
    
                  
                const registros=result['data']
              
                setImgresumen(registros[0].imgResumen)
                setImgingreso(registros[0].imgIngresos)
                setImgegreso(registros[0].imgEgresos)
                  

                  
                  
                  
                  
              }else if(respuesta === 403 || respuesta === 401){
                  
                  
                  await Handelstorage('borrar')
                  await new Promise(resolve => setTimeout(resolve, 1000))
                  setActivarsesion(false)
              }
              
              setCargacopleta(true)
    
             
          }
          cargardatos()
          // setRefresh(false)
        })
        return unsubscribe;
        }, [navigation]);
    
    if(cargacompleta)
        {

            return(
            <View  style={{ flex: 1}}>
                <Text> Estaditicas del mes </Text>
                <Image
                    source={{ uri: `data:image/png;base64,${imgegreso}` }}
                    style={{ width: 200, height: 200 }} // Ajusta el tamaño según sea necesario
                />
            </View>
            )
    }
}

export default Estadisticas