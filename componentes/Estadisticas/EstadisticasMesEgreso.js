import React,{useState,useEffect,useContext } from "react";
import {  View    } from "react-native";
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";
import { useTheme } from '@react-navigation/native';
import { AuthContext } from "../../AuthContext";
import ImagenEstadistica from "./ImagenEstadistica";


function EstadisticasMesEgreso ({ navigation  }){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { colors } = useTheme();
    const [cargacompleta,setCargacopleta]=useState(false)
    const [guardando,setGuardando]=useState(false)
    const [imgegreso,setImgegreso]=useState([])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          
          const cargardatos=async()=>{
                setGuardando(true)
                const datestorage=await Handelstorage('obtenerdate');
                const mes_storage=datestorage['datames']
                const anno_storage=datestorage['dataanno']

                const body = {};
                const endpoint='MovileEstadisticaMesEgreso/' + anno_storage +'/' + mes_storage + '/'
                const result = await Generarpeticion(endpoint, 'POST', body);
                const respuesta=result['resp']
                if (respuesta === 200){
        
                    
                    const registros=result['data']
                    setImgegreso(registros[0].imgEgresos)
                    setGuardando(false)
                
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
                
                <ImagenEstadistica imgprops={imgegreso}></ImagenEstadistica>

             
                
            </View>
            )
    }
}



export default EstadisticasMesEgreso