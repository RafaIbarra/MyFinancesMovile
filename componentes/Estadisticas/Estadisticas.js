import React,{useState,useEffect,useContext,useCallback } from "react";
import {  View   } from "react-native";
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";
import { useTheme } from '@react-navigation/native';
import { AuthContext } from "../../AuthContext";
import ImagenEstadistica from "./ImagenEstadistica";


function Estadisticas ({ navigation  }){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { updstastsaldo, setUpdstastsaldo } = useContext(AuthContext);
    
    const { imgestadisticasaldo, setImgestadisticasaldo } = useContext(AuthContext);
   

    const { colors } = useTheme();
    const [cargacompleta,setCargacopleta]=useState(false)
    const [imgresumen,setImgresumen]=useState([])
    const [guardando,setGuardando]=useState(false)
    
    
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const cargardatos = async () => {
            setGuardando(true);
        
            if (updstastsaldo) {
                const datestorage = await Handelstorage("obtenerdate");
                const mes_storage = datestorage["datames"];
                const anno_storage = datestorage["dataanno"];
        
                const body = {};
                const endpoint = `MovileEstadisticaMesSaldo/${anno_storage}/${mes_storage}/`;
                const result = await Generarpeticion(endpoint, "POST", body);
                const respuesta = result["resp"];
        
                if (respuesta === 200) {
                    setUpdstastsaldo(false);
                    const registros = result["data"];
                    setImgresumen(registros[0].imgResumen);
                    setImgestadisticasaldo(registros[0].imgResumen);
                } else if (respuesta === 403 || respuesta === 401) {
                    setGuardando(false);
                    await Handelstorage("borrar");
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    setActivarsesion(false);
                }
            } else {
                setImgresumen(imgestadisticasaldo);
            }
        
            setGuardando(false);
            setCargacopleta(true);
            };
        
            cargardatos();
        })
        return unsubscribe;
      }, [updstastsaldo, setImgestadisticasaldo, imgestadisticasaldo,navigation]);


    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //       setGuardando(true)
    //       const cargardatos=async()=>{
                
                
    //             if(updstastsaldo){
                    
    //                 const datestorage=await Handelstorage('obtenerdate');
    //                 const mes_storage=datestorage['datames']
    //                 const anno_storage=datestorage['dataanno']
    
    //                 const body = {};
    //                 const endpoint='MovileEstadisticaMesSaldo/' + anno_storage +'/' + mes_storage + '/'
    //                 const result = await Generarpeticion(endpoint, 'POST', body);
    //                 const respuesta=result['resp']
    //                 if (respuesta === 200){
    //                     setUpdstastsaldo(false)
                        
    //                     setGuardando(false)
                        
    //                     const registros=result['data']
                    
    //                     setImgresumen(registros[0].imgResumen)  
    //                     setImgestadisticasaldo(registros[0].imgResumen)
    //                 }else if(respuesta === 403 || respuesta === 401){
                        
    //                     setGuardando(false)
    //                     await Handelstorage('borrar')
    //                     await new Promise(resolve => setTimeout(resolve, 1000))
    //                     setActivarsesion(false)
    //                 }
    //             }else{
                    
    //                 setImgresumen(imgestadisticasaldo) 
    //             }
    //             setGuardando(false)
    //             setCargacopleta(true)
    
             
    //       }
    //       cargardatos()
    //       // setRefresh(false)
    //     })
    //     return unsubscribe;
    //     }, [navigation]);
    
    

    return(
    <View  style={{ flex: 1}}>
        {guardando &&(<Procesando></Procesando>)}
        <ImagenEstadistica imgprops={imgresumen}></ImagenEstadistica> 
    </View>
    )
    
}



export default Estadisticas