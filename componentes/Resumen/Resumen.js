import React,{useState,useEffect } from "react";
import { ActivityIndicator, View,Text,StyleSheet,TextInput  } from "react-native";
import {DefaultTheme, Provider} from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

import { TouchableOpacity, FlatList } from 'react-native';


function Resumen (){
  const { colors } = useTheme();
  const [expandedItem, setExpandedItem] = useState(null);
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

    return(
        

        <View style={styles.container} >
            <Text style={{ color: colors.text }}> Resumen del mes aca prueba colores Anita</Text>
            <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
            
        </View>
        
    )



}
const styles = StyleSheet.create({
    container: {
      flex: 1
    },
   
  });


export default Resumen