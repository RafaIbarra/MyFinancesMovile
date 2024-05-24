import React,{useState,useEffect,useContext,useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {  View,Text, StyleSheet,FlatList,TouchableOpacity,SafeAreaView,Animated,TextInput   } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';


import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";

import { AuthContext } from "../../AuthContext";
import { useTheme } from '@react-navigation/native';

/*Iconos*/
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';



function CategoriaGastos ({ navigation  }){

    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);
    const [guardando,setGuardando]=useState(false)
    const [textobusqueda,setTextobusqueda]=useState('')
    
    const [rotationValue] = useState(new Animated.Value(0));
    const { colors } = useTheme();

    const [cargacompleta,setCargacopleta]=useState(false)
    const [dataingresos,setDataingresos]=useState([])
    const [dataingresoscompleto,setDataingresoscompleto]=useState([])
    const [montototalingreso,setMontototalingreso]=useState(0)
    const [canttotalingreso,setcanttotalingreso]=useState(0)
    const { navigate } = useNavigation();


    const chunk = (array, size) => {
        return array.reduce((chunks, el, i) => {
          if (i % size === 0) {
            chunks.push([el]);
          } else {
            chunks[chunks.length - 1].push(el);
          }
          return chunks;
        }, []);
      };

    const handlePress = () => {
        
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 200, // Duración de la animación en milisegundos
          useNativeDriver: true,
        }).start(() => {
          // Restaura la animación a su estado original
          rotationValue.setValue(0);
        });
        const concepto={'id':0,'nombre_producto':'','tipoproducto':0}
        navigate("CategoriaGastosRegistro", { concepto})
        
        
      };
    
      // Interpola el valor de rotación para aplicarlo al estilo de transformación del icono
    const spin = rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      } 
    );



    const realizarbusqueda= (palabra)=>{
      setTextobusqueda(palabra)
      const pal =palabra.toLowerCase()
      let arrayencontrado = dataingresoscompleto.filter(item => 
        item.nombre_categoria.toLowerCase().includes(pal)
        );

      const conceptosGrupos = chunk(arrayencontrado, 2)
      setDataingresos(conceptosGrupos)
    }
   
    useEffect(() => {
        
            const cargardatos=async()=>{
                console.log(estadocomponente.categoriagasto)
                setGuardando(true)
                const body = {};
                const endpoint='MisCategorias/0/'
                const result = await Generarpeticion(endpoint, 'POST', body);
                const respuesta=result['resp']
                if (respuesta === 200){

                    const registros=result['data']
                    

                    if(Object.keys(registros).length>0){
                      registros.forEach((elemento) => {
                        
                        elemento.recarga='no'
                      })
                    }
                    
                    setDataingresoscompleto(registros)

                    const conceptosGrupos = chunk(registros, 2)
                    setDataingresos(conceptosGrupos)
                    
                    
                    let cantingreso=0
                    registros.forEach(({ id }) => {cantingreso+=1})
                    
                    setcanttotalingreso(cantingreso)
                    
                    
                }else if(respuesta === 403 || respuesta === 401){
                
                
                    await Handelstorage('borrar')
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    setActivarsesion(false)
                }
                setCargacopleta(true)
                setGuardando(false)
            
            }
            cargardatos()

         
        
    }, [estadocomponente.categoriagasto]);
    
    
    
 

    return(
        <SafeAreaView style={{ flex: 1 }}>
            {guardando &&(<Procesando></Procesando>)}
            <View style={{ flex: 1 }}>    
                <View style={styles.cabeceracontainer}>
                    <Text style={[styles.titulocabecera, { color: colors.text}]}>Categoria Gastos</Text>

                    <TouchableOpacity style={[styles.botoncabecera,{ backgroundColor:'rgb(218,165,32)'}]} onPress={handlePress}>
                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                            <FontAwesome6 name="add" size={24} color="white" />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
                <View style={{marginLeft:10,marginRight:10,padding:10,marginBottom:20}}>
                  
                    <View style={{ borderWidth:1,backgroundColor:'rgba(28,44,52,0.1)',borderRadius:10,borderColor:'white',flexDirection: 'row',alignItems: 'center'}}>
                            <TextInput 
                                    style={{color:colors.text,padding:5,}} 
                                    placeholder="Buscar.."
                                    placeholderTextColor='gray'
                                    value={textobusqueda}
                                    onChangeText={textobusqueda => realizarbusqueda(textobusqueda)}
                                    >

                            </TextInput>

                            <TouchableOpacity style={{ position: 'absolute',right: 10,}}  >  
                              <FontAwesome name="search" size={24} color={colors.iconcolor}/>
                            </TouchableOpacity>
                    </View>
                </View>

                

                <FlatList
                    data={dataingresos}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', marginBottom: 10,marginLeft:5,marginRight:5 }}>
                            {item.map(concepto => (
                                
                                  
                                  
                                    <TouchableOpacity key={concepto.id} 
                                                      style={{ flex: 1, marginHorizontal: 5,borderWidth:1,
                                                          borderRadius:10,borderColor:colors.bordercolor}}
                                                      onPress={() => {navigate('CategoriaGastosDetalle', { concepto });}}
                                                      >


                                        <LinearGradient key={concepto.nombre_producto} 
                                                        colors={['#182120', '#12262c', '#0b2a37']}
                                                        style={{borderRadius:10,padding:10}}
                                        >

                                          <View style={{flexDirection:'row'}}>
                                            <FontAwesome6 name="check" size={20} color="green" />
                                            <Text style={[styles.textoconcepto,{ marginLeft:5,color: colors.text,paddingRight:10}]}>{concepto.nombre_categoria}</Text>
                                          </View>

                                          
                                          
                                          
                                        </LinearGradient>

                                    </TouchableOpacity  >
                                  
                                
                            ))}
                        </View>
                    )}
                    />
                



                <View style={styles.resumencontainer}>

                    <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                        <Text style={styles.labeltext}>Cantidad Registros:</Text>{' '}
                        {Number(canttotalingreso).toLocaleString('es-ES')}
                    </Text>
                    
                    
                </View>

            </View>
        </SafeAreaView>

        
    )
    
}
const styles = StyleSheet.create({
    
    cabeceracontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        // borderBottomColor: 'lightgray',
        
      },
    
    titulocabecera: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        // color:'white'
      },
    textocontenido:{
      fontSize:12.5,
      marginBottom:5,
      
    },
    textoconcepto:{
      fontSize:15,
      marginBottom:5,
      fontWeight:'bold',
      fontStyle:'italic'
      
      
    },
    botoncabecera: {
        
        width: 40, // Define el ancho del botón
        height: 40, // Define la altura del botón
        borderRadius: 20, // Define la mitad de la dimensión del botón para obtener una forma circular
        justifyContent: 'center', // Alinea el contenido (icono) verticalmente en el centro
        alignItems: 'center', // Alinea el contenido (icono) horizontalmente en el centro
  },
  resumencontainer: {
      
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderWidth:0.5,
      borderTopRightRadius:50,
      borderColor:'gray',

      paddingLeft:30,
      paddingBottom:20

      
    },
  contenedortexto:{
      paddingBottom:10,
      fontSize:15,
      
    },
  labeltext:{
      fontWeight:'bold',
      fontSize:15
  },
  Tituloresumen: {
    
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom:5
  },

  });
export default CategoriaGastos