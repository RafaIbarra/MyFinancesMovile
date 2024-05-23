import React,{useState,useEffect,useContext,useRef } from "react";
import {  View    } from "react-native";
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";
import { useTheme } from '@react-navigation/native';
import { AuthContext } from "../../AuthContext";
import ImagenEstadistica from "./ImagenEstadistica";


function EstadisticasMesIngreso ({ navigation  }){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { colors } = useTheme();
    const [cargacompleta,setCargacopleta]=useState(false)
    const [guardando,setGuardando]=useState(false)
    const [imgingreso,setImgingreso]=useState([])
    

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          
          const cargardatos=async()=>{
                setGuardando(true)
                const datestorage=await Handelstorage('obtenerdate');
                const mes_storage=datestorage['datames']
                const anno_storage=datestorage['dataanno']

                const body = {};
                const endpoint='MovileEstadisticaMesIngreso/' + anno_storage +'/' + mes_storage + '/'
                const result = await Generarpeticion(endpoint, 'POST', body);
                const respuesta=result['resp']
                if (respuesta === 200){
        
                    setGuardando(false)
                    const registros=result['data']
                
                    setImgingreso(registros[0].imgIngresos)
                
                }else if(respuesta === 403 || respuesta === 401){
                    
                    setGuardando(false)
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
                {guardando &&(<Procesando></Procesando>)}
                <ImagenEstadistica imgprops={imgingreso}></ImagenEstadistica>
            </View>
            )
    }
}



export default EstadisticasMesIngreso