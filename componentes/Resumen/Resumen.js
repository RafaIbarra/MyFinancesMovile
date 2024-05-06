import React,{useState,useEffect,useContext } from "react";
import { ActivityIndicator, View,Text,StyleSheet,TextInput,TouchableOpacity, FlatList  } from "react-native";
import { useTheme } from '@react-navigation/native';



import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
// import { AuthContext } from "../../AuthContext";

function Resumen ({ navigation  }){
  const { colors } = useTheme();
  // const { activarsesion, setActivarsesion } = useContext(AuthContext);
  const [expandedItem, setExpandedItem] = useState(null);
  const [datadetalle,setDatadetalle]=useState([])
  const [cargacompleta,setCargacopleta]=useState(false)
  const [searchValue, setSearchValue] = useState('');

  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      
      const cargardatos=async()=>{
          // const datestorage=await Handelstorage('obtenerdate');
          // const mes_storage=datestorage['datames']
          // const anno_storage=datestorage['dataanno']
          // const body = {};
          // const endpoint='MovileResumenMes/' + anno_storage +'/' + mes_storage + '/'
          // const result = await Generarpeticion(endpoint, 'POST', body);
          // const respuesta=result['resp']
          // if (respuesta === 200){

          //     console.log(result['data']['datos'])
              
          //     // const detalle=result['data']['datos'].filter(item => item.Codigo !== 3);
          //     // console.log(detalle)
          //     // setDatadetalle(detalle)
              
              
              
              
          // }else if(respuesta === 403 || respuesta === 401){
              
              
          //     await Handelstorage('borrar')
          //     await new Promise(resolve => setTimeout(resolve, 1000))
          //     setActivarsesion(false)
          // }
          
          setCargacopleta(true)

         
      }
      cargardatos()
      // setRefresh(false)
    })
    return unsubscribe;
    }, [navigation]);

   
    return(
        

        <View style={styles.container} >
            <Text style={{ color: 'white' }}> Resumen del mes aca prueba colores Anita</Text>
               
            
        </View>
        
    )



}
const styles = StyleSheet.create({
    container: {
      flex: 1
    },
   
  });


export default Resumen