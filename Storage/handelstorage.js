import React,{useState,useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
async function  Handelstorage (opcion,item,valor){
    async function agregar(data){
        // localStorage.setItem('userData', JSON.stringify(data))
        await AsyncStorage.setItem('userData', JSON.stringify(data));

        const fechaActual = new Date();
        const mesactual = parseInt(fechaActual.getMonth() + 1);
        const añoActual = parseInt(fechaActual.getFullYear());
        const datadate={
          datames:mesactual,
          dataanno:añoActual
        }
        const datastats={
          dataanno:añoActual
        }
        
        // localStorage.setItem('userdate', JSON.stringify(datadate))
        // localStorage.setItem('userstats', JSON.stringify(datastats))
        await AsyncStorage.setItem("userdate", JSON.stringify(datadate));
        await AsyncStorage.setItem("userstats", JSON.stringify(datastats));

    }

    const obtener= async()=>{
        
        //const userLocalStorageData = JSON.parse(localStorage.getItem('userData'));
        const userJSON = await AsyncStorage.getItem("userData");
        const userLocalStorageData = JSON.parse(userJSON);
        if (userLocalStorageData !== null){
          return {
            token: userLocalStorageData.token,
            refreshToken: userLocalStorageData.refreshToken,
            sesion: userLocalStorageData.sesion,
            user_name: userLocalStorageData.user_name,
            
          };
        }else{
          return {
            token: false,
            refreshToken: false,
            sesion: false,
            user_name: false,
            
          };
        }
    }

  const obtenerdate= async()=>{
      const valordate= await AsyncStorage.getItem("userdate");
      const userLocalStorageDate = JSON.parse(valordate);
      if (userLocalStorageDate !== null){
        return {
          datames: userLocalStorageDate.datames,
          dataanno: userLocalStorageDate.dataanno,
          
          
        };
      }else{
        return {
          datames: 0,
          dataanno: 0,
          
        };
      }
    }

  const borrar= async()=>{
      
    await AsyncStorage.removeItem("userdate")
    await AsyncStorage.removeItem("userData")
    await AsyncStorage.removeItem("userstats")
    }


    if (opcion === 'agregar') {
        agregar(item);
      }
    else if(opcion === 'obtener') {
        let resultado=obtener()
        return resultado
      }
    else if(opcion === 'obtenerdate') {
        let resultado=obtenerdate()
        return resultado
      }
    else if(opcion === 'borrar') {
        borrar()
      }

}
export default Handelstorage