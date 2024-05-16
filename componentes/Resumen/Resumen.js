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