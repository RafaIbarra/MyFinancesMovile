import React,{useState,useEffect,useContext,useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {  View,Text, StyleSheet,FlatList,TouchableOpacity,SafeAreaView,Animated,TextInput   } from "react-native";
import { Modal, Portal,  PaperProvider,Dialog,Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { IconButton } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';

import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";

import { useTheme } from '@react-navigation/native';
import { AuthContext } from "../../AuthContext";

function Gastos ({ navigation  }){
    
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const [busqueda,setBusqueda]=useState(false)
    const [textobusqueda,setTextobusqueda]=useState('')
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { colors } = useTheme();
    
    const [cargacompleta,setCargacopleta]=useState(false)
    const [dateegresoscompleto,setDateegresoscompleto]=useState([])
    const [dataegresos,setDataegresos]=useState([])
    const [rotationValue] = useState(new Animated.Value(0));
    
    const { navigate } = useNavigation();


    
    const [montototalegreso,setMontototalegreso]=useState(0)
    const [canttotalegreso,setcanttotalegreso]=useState(0)
    
    
   
    const handlePress = () => {
        
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 200, // Duración de la animación en milisegundos
          useNativeDriver: true,
        }).start(() => {
          // Restaura la animación a su estado original
          rotationValue.setValue(0);
        });
        const item={'id':0}
        navigate("GastosRegistro", { item})
        
      };
    
      // Interpola el valor de rotación para aplicarlo al estilo de transformación del icono
    const spin = rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      } 
    );


    const openbusqueda =()=>{
      setBusqueda(true);
    // Inicia la animación para mostrar el cuadro de búsqueda
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700, // Duración de la animación en milisegundos
      useNativeDriver: false,
    }).start();
    }

    const closebusqueda=()=>{
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(() => setBusqueda(false));
      realizarbusqueda('')
    }

    const realizarbusqueda= (palabra)=>{
      setTextobusqueda(palabra)
      const pal =palabra.toLowerCase()
      let arrayencontrado = dateegresoscompleto.filter(item => 
        item.NombreGasto.toLowerCase().includes(pal) ||
        item.CategoriaGasto.toLowerCase().includes(pal)
        );
      setDataegresos(arrayencontrado)
    }


    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        setCargacopleta(false)
        const cargardatos=async()=>{
            const datestorage=await Handelstorage('obtenerdate');
            const mes_storage=datestorage['datames']
            const anno_storage=datestorage['dataanno']
            const body = {};
            const endpoint='MovileMisEgresos/' + anno_storage +'/' + mes_storage + '/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            const respuesta=result['resp']
            if (respuesta === 200){
                const registros=result['data']
                
                if(Object.keys(registros).length>0){
                    registros.forEach((elemento) => {
                      
                      elemento.key = elemento.id;
                    })
                    
                    // console.log(registros)
                    setDataegresos(registros)
                    setDateegresoscompleto(registros)
                    let totalgasto=0
                    let cantgasto=0
                    registros.forEach(({ monto_gasto }) => {totalgasto += monto_gasto,cantgasto+=1})
                    setMontototalegreso(totalgasto)
                    setcanttotalegreso(cantgasto)
                }
                
            }else if(respuesta === 403 || respuesta === 401){
                
                
                await Handelstorage('borrar')
                await new Promise(resolve => setTimeout(resolve, 1000))
                setActivarsesion(false)
            }
            
            //console.log(busqueda)
            if(busqueda){
              //console.log(textobusqueda)
              
              realizarbusqueda(textobusqueda)
            }
            setCargacopleta(true)
            // setBusqueda(false)
            // setTextobusqueda('')

           
        }
        cargardatos()
        // setRefresh(false)
      })
      return unsubscribe;
      }, [navigation]);

    if(cargacompleta){

        return(
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar />

                
                    
                  <View style={{ flex: 1 }}>    
                      <View style={styles.cabeceracontainer}>

                      {!busqueda &&( 
                          <TouchableOpacity onPress={openbusqueda}>
                              
                              <FontAwesome name="search" size={24} color={colors.iconcolor}/>
                              
                          </TouchableOpacity>
                      )}
                      {!busqueda &&( <Text style={[styles.titulocabecera, { color: colors.text}]}>Registro Gastos</Text>)}


                      {busqueda &&(

                          <Animated.View style={{ borderWidth:1,backgroundColor:'rgba(28,44,52,0.1)',borderRadius:10,borderColor:'white',flexDirection: 'row',alignItems: 'center',width:'80%',opacity: fadeAnim}}>
                            <TextInput 
                                  style={{color:'white',padding:5,
                                          // backgroundColor:'rgba(28,44,52,0.1)'
                                          //backgroundColor:'red', 
                                          flex: 1,}} 
                                  placeholder="Concepto o Categoria.."
                                  placeholderTextColor='gray'
                                  value={textobusqueda}
                                  onChangeText={textobusqueda => realizarbusqueda(textobusqueda)}
                                  >

                            </TextInput>

                            <TouchableOpacity style={{ position: 'absolute',right: 10,}} onPress={closebusqueda} >  
                              <AntDesign name="closecircleo" size={20} color={colors.iconcolor} />
                            </TouchableOpacity>
                          </Animated.View>
                        )
                        }

                          
                          <TouchableOpacity style={[styles.botoncabecera,
                                                  { 
                                                    // backgroundColor: colors.iconcolor
                                                    backgroundColor:'rgb(218,165,32)'
                                                  }]} onPress={handlePress}
                          >
                              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                  <FontAwesome6 name="add" size={24} color="white" />
                              </Animated.View>
                          </TouchableOpacity>
                      </View>

                      
                    <View  style={styles.container}>

                          <FlatList 
                              data={dataegresos}
                              renderItem={({item}) =>{
                                  return(
                                      <TouchableOpacity  style={[styles.contenedordatos,{ borderColor: colors.bordercolor}]} 
                                       onPress={() => {navigate('GastosDetalle', { item });}}
                                      
                                      >
                                          <View style={[styles.columna, { flex: 2 }]}> 
                                              <Text style={[styles.textocontenido,{ color: colors.text}]}> Categoria: {item.CategoriaGasto}</Text>
                                              <Text style={[styles.textocontenido,{ color: colors.text}]}> Concepto: {item.NombreGasto}</Text>
                                              <Text style={[styles.textocontenido,{ color: colors.text}]}> Fecha Gasto: {moment(item.fecha_gasto).format('DD/MM/YYYY')}</Text>
                                              <Text style={[styles.textocontenido,{ color: colors.text}]}> Fecha Registro: {moment(item.fecha_registro).format('DD/MM/YYYY HH:mm:ss')}</Text>
                                              
                                              
                                          </View>

                                          <View style={[styles.columna, { flex: 1,marginTop:30 }]}> 

                                              <Text style={[styles.textototal,{ color: colors.text,fontWeight:'bold'}]}> Gs.: {Number(item.monto_gasto).toLocaleString('es-ES')} </Text>
                                              
                                          </View>
                                      </TouchableOpacity >
                                  )
                              }
                          }
                              keyExtractor={item => item.key}
                          />
                        
                    </View>


                    
                    <View style={styles.resumencontainer}>

                        <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                          <Text style={styles.labeltext}>Cantidad Registros:</Text>{' '}
                            {Number(canttotalegreso).toLocaleString('es-ES')}
                        </Text>
                        <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                          <Text style={styles.labeltext}>Total Gasto:</Text>{' '}
                            {Number(montototalegreso).toLocaleString('es-ES')} Gs.
                        </Text>
                        
                    </View>

                  </View>
                    
                
            </SafeAreaView>
    
            
        )
    }




    
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
    gradient: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
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
      // color:'white'
    },
    textototal:{
      fontSize:17,
      
      // color:'white'
    },
    botoncabecera: {
        // backgroundColor: 'blue',
        width: 40, // Define el ancho del botón
        height: 40, // Define la altura del botón
        borderRadius: 20, // Define la mitad de la dimensión del botón para obtener una forma circular
        justifyContent: 'center', // Alinea el contenido (icono) verticalmente en el centro
        alignItems: 'center', // Alinea el contenido (icono) horizontalmente en el centro
      },

    botonaccion: {
        
        width: 40, // Define el ancho del botón
        height: 40  , // Define la altura del botón
        borderRadius: 5, // Define la mitad de la dimensión del botón para obtener una forma circular
        justifyContent: 'center', // Alinea el contenido (icono) verticalmente en el centro
        alignItems: 'center', // Alinea el contenido (icono) horizontalmente en el centro
        
      },
  textoBoton: {
        // color: 'white',
        fontWeight: 'bold',
      },
    
  container: {
        flex: 1,
        // backgroundColor:'#1c2c34'
        // backgroundColor:'rgba(28,44,52,0.7)'
        //backgroundColor:'#242c34'
        //backgroundColor:'#202c34'
      },
  contenedordatos:{
        flexDirection: 'row',
        borderRadius: 10,
        borderWidth: 1,
        //borderColor: '#ccc',
        overflow: 'hidden', 
        height: 110,
        padding: 10,
        margin:5,
        
    },
  columnadatos:{
        flex: 1,
        height: '100%',
        // backgroundColor: '#f0f0f0',
    },
  resumencontainer: {
      //flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderWidth:0.5,
      borderTopRightRadius:50,
      borderColor:'gray',
      // backgroundColor:'white',
      // backgroundColor:'rgb(28,44,52)',
      paddingLeft:30

      
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
export default Gastos