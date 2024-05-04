import React,{useState,useEffect,useContext } from "react";
import { ActivityIndicator, View,Text,StyleSheet,TextInput  } from "react-native";
import {DefaultTheme, Provider} from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

import { TouchableOpacity, FlatList } from 'react-native';

import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import { AuthContext } from "../../AuthContext";

function Resumen ({ navigation  }){
  const { colors } = useTheme();
  const { activarsesion, setActivarsesion } = useContext(AuthContext);
  const [expandedItem, setExpandedItem] = useState(null);
  const [datadetalle,setDatadetalle]=useEffect([])
  const [cargacompleta,setCargacopleta]=useState(false)
  const [searchValue, setSearchValue] = useState('');

  const data = [
    { 
      id: 1, 
    title: 'Item 1', 
    content: [
      'Opción 1 para Item 1',
      'Opción 2 para Item 1',
      'Opción 3 para Item 1',
    ],
    },
    { 
      id: 2, 
      title: 'Item 2', 
      content: [
        'Opción 1 para Item 2',
        'Opción 2 para Item 2',
        'Opción 3 para Item 2',
      ],
    },
    { 
      id: 3, 
      title: 'Item 3', 
      content: [
        'Opción 1 para Item 3',
        'Opción 2 para Item 3',
        'Opción 3 para Item 3',
      ],
    },
  ];

  const renderItem = ({ item }) => {
    const isExpanded = item.id === expandedItem;

    const toggleItem = () => {
      setExpandedItem(isExpanded ? null : item.id);
    };

    const filteredContent = item.content.filter(option =>
      option.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <View>
        <TouchableOpacity onPress={toggleItem}>
          <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
        </TouchableOpacity>
        {isExpanded && (
          <View>
            <TextInput
              placeholder="Buscar..."
              value={searchValue}
              onChangeText={setSearchValue}
            />
            <FlatList
              data={filteredContent}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(option) => option}
            />
          </View>
        )}
      </View>
    );
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      
      const cargardatos=async()=>{
          const datestorage=await Handelstorage('obtenerdate');
          const mes_storage=datestorage['datames']
          const anno_storage=datestorage['dataanno']
          const body = {};
          const endpoint='MovileResumenMes/' + anno_storage +'/' + mes_storage + '/'
          const result = await Generarpeticion(endpoint, 'POST', body);
          const respuesta=result['resp']
          if (respuesta === 200){

              console.log(result['data']['datos'])
              
              // const detalle=result['data']['datos'].filter(item => item.Codigo !== 3);
              // console.log(detalle)
              // setDatadetalle(detalle)
              
              
              
              
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

    if(cargacompleta){
          return(
              

              <View style={styles.container} >
                  <Text style={{ color: colors.text }}> Resumen del mes aca prueba colores Anita</Text>
                  {/* <FlatList
            data={datadetalle}
            rrenderItem={({ item }) => (
              <View>
                <Text>{item.Descripcion}</Text>
                <Text>Código: {item.Codigo}</Text>
                <Text>Monto de Egreso: {item.MontoEgreso}</Text>
                <Text>Monto de Ingreso: {item.MontoIngreso}</Text>
                <Text>Saldo: {item.Saldo}</Text>
                <Text>Tipo: {item.Tipo}</Text>
              </View>
            )}
            keyExtractor={item => item.Descripcion.toString()}
          /> */}
                  
              </View>
              
          )
    }


}
const styles = StyleSheet.create({
    container: {
      flex: 1
    },
   
  });


export default Resumen