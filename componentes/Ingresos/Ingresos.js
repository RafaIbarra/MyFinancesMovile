import React,{useState,useEffect,useContext,useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {  View,Text, StyleSheet,FlatList,TouchableOpacity,SafeAreaView,Animated,TextInput   } from "react-native";
import moment from 'moment';

import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";
import { AuthContext } from "../../AuthContext";
import { useTheme } from '@react-navigation/native';

/*Iconos*/
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


function Ingresos ({ navigation  }){

    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    
    const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);
    const [busqueda,setBusqueda]=useState(false)
    const [textobusqueda,setTextobusqueda]=useState('')
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [rotationValue] = useState(new Animated.Value(0));
    const { colors } = useTheme();
    const [guardando,setGuardando]=useState(false)
    const [cargacompleta,setCargacopleta]=useState(false)
    const [dataingresos,setDataingresos]=useState([])
    const [dataingresoscompleto,setDataingresoscompleto]=useState([])
    const [montototalingreso,setMontototalingreso]=useState(0)
    const [canttotalingreso,setcanttotalingreso]=useState(0)
    const { navigate } = useNavigation();


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
        navigate("IngresoTransaccion", { item})
        
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
      let arrayencontrado = dataingresoscompleto.filter(item => 
        item.NombreIngreso.toLowerCase().includes(pal)
        );
      setDataingresos(arrayencontrado)
    }
   
    useEffect(() => {
        
        const unsubscribe = navigation.addListener('focus', () => {
          setGuardando(true)
            const cargardatos=async()=>{
                
                if(estadocomponente.compingresos){

                  const datestorage=await Handelstorage('obtenerdate');
                  const mes_storage=datestorage['datames']
                  const anno_storage=datestorage['dataanno']
                  const body = {};
                  const endpoint='MovileMisIngresos/' + anno_storage +'/' + mes_storage + '/'
                  const result = await Generarpeticion(endpoint, 'POST', body);
                  const respuesta=result['resp']
                  
                  if (respuesta === 200){
                      const registros=result['data']
                      
                      if(Object.keys(registros).length>0){
                          registros.forEach((elemento) => {
                          
                          elemento.key = elemento.id;
                          elemento.recarga='no'
                          })
                      }
                      setDataingresos(registros)
                      setDataingresoscompleto(registros)
                      let totalingreso=0
                      let cantingreso=0
                      registros.forEach(({ monto_ingreso }) => {totalingreso += monto_ingreso,cantingreso+=1})
                      setMontototalingreso(totalingreso)
                      setcanttotalingreso(cantingreso)
                      setGuardando(false)
                      actualizarEstadocomponente('compingresos',false)
                      actualizarEstadocomponente('dataingresos',registros)
                      
                  }else if(respuesta === 403 || respuesta === 401){
                  
                      setGuardando(false)
                      await Handelstorage('borrar')
                      await new Promise(resolve => setTimeout(resolve, 1000))
                      setActivarsesion(false)
                  }
                }else{
                      const registros=estadocomponente.dataingresos
                      setDataingresoscompleto(registros)
                      let totalingreso=0
                      let cantingreso=0
                      registros.forEach(({ monto_ingreso }) => {totalingreso += monto_ingreso,cantingreso+=1})
                      setMontototalingreso(totalingreso)
                      setcanttotalingreso(cantingreso)
                      setGuardando(false)
                }
                if (textobusqueda.length>0){
                  realizarbusqueda(textobusqueda)
                 }
                setCargacopleta(true)

            
            }
            cargardatos()

        })
          return unsubscribe;
    }, [estadocomponente.compingresos,actualizarEstadocomponente,navigation,textobusqueda]);
    
    
    
    

    return(
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ flex: 1 }}>
                {guardando &&(<Procesando></Procesando>)}
                <View style={styles.cabeceracontainer}>

                    {!busqueda &&( 
                        <TouchableOpacity onPress={openbusqueda}>
                            
                            <FontAwesome name="search" size={24} color={colors.iconcolor}/>
                            
                        </TouchableOpacity>
                    )}
                    {!busqueda &&( <Text style={[styles.titulocabecera, { color: colors.text}]}>Registro Ingresos</Text>)}


                    {busqueda &&(

                        <Animated.View style={{ borderWidth:1,backgroundColor:'rgba(28,44,52,0.1)',borderRadius:10,borderColor:'white',flexDirection: 'row',alignItems: 'center',width:'80%',opacity: fadeAnim}}>
                        <TextInput 
                                style={{color:'white',padding:5,flex: 1,}} 
                                placeholder="Concepto.."
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

                        
                    <TouchableOpacity style={[styles.botoncabecera,{ backgroundColor:'rgb(218,165,32)'}]} 
                                        onPress={handlePress}
                    >
                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                            <FontAwesome6 name="add" size={24} color="white" />
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                
                <View  style={styles.container}>

                        <FlatList 
                            data={dataingresos}
                            renderItem={({item}) =>{
                                return(
                                    <TouchableOpacity style={[styles.contenedordatos,{ borderRightColor: colors.bordercolor,borderBottomColor:'rgba(235,234,233,0.1)'}]} 
                                                        onPress={() => {navigate('IngresoDetalle', { item });}}
                                    
                                    >
                                        <View style={[styles.columna, { flex: 2 }]}> 
                                            <Text style={[styles.textocontenido,{ color: colors.text}]}> Tipo: {item.TipoIngreso}</Text>
                                            <Text style={[styles.textocontenido,{ color: colors.text}]}> Concepto: {item.NombreIngreso}</Text>
                                            <Text style={[styles.textocontenido,{ color: colors.text}]}> Fecha Ingreso: {moment(item.fecha_ingreso).format('DD/MM/YYYY')}</Text>
                                            <Text style={[styles.textocontenido,{ color: colors.text}]}> Fecha Registro: {moment(item.fecha_registro).format('DD/MM/YYYY HH:mm:ss')}</Text>
                                            
                                            
                                        </View>

                                        <View style={[styles.columna, { flex: 1,marginTop:30 }]}> 

                                            <Text style={[styles.textototal,{ color: colors.text,fontWeight:'bold'}]}> Gs.: {Number(item.monto_ingreso).toLocaleString('es-ES')} </Text>
                                            
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
                        {Number(canttotalingreso).toLocaleString('es-ES')}
                    </Text>
                    <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                        <Text style={styles.labeltext}>Total Ingreso:</Text>{' '}
                        {Number(montototalingreso).toLocaleString('es-ES')} Gs.
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
      
    },
    botoncabecera: {
        width: 40, // Define el ancho del botón
        height: 40, // Define la altura del botón
        borderRadius: 20, // Define la mitad de la dimensión del botón para obtener una forma circular
        justifyContent: 'center', // Alinea el contenido (icono) verticalmente en el centro
        alignItems: 'center', // Alinea el contenido (icono) horizontalmente en el centro
      },

  container: {
        flex: 1,

      },
  contenedordatos:{
        flexDirection: 'row',
        borderBottomWidth:1,
        borderRightWidth:3,
        marginBottom:10,
        marginRight:5,

        overflow: 'hidden', 
        height: 110,
        padding: 10,
        
        
    },

  resumencontainer: {
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderWidth:0.5,
      borderTopRightRadius:50,
      borderColor:'gray',
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


  });
export default Ingresos