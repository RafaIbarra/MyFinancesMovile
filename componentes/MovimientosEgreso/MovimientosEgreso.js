import React,{useState,useEffect,useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {  View,Text, StyleSheet,FlatList,TouchableOpacity,SafeAreaView,TextInput   } from "react-native";
import { StatusBar } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';

import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";

import { useTheme } from '@react-navigation/native';
import { AuthContext } from "../../AuthContext";

function MovimientosEgreso ({ navigation  }){
    
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const [busqueda,setBusqueda]=useState(false)
    const [textobusqueda,setTextobusqueda]=useState('')
    
    const { colors } = useTheme();
    
    const [cargacompleta,setCargacopleta]=useState(false)
    const [dateegresoscompleto,setDateegresoscompleto]=useState([])
    const [dataegresos,setDataegresos]=useState([])
        
    const { navigate } = useNavigation();

    const [montototalegreso,setMontototalegreso]=useState(0)
    const [canttotalegreso,setcanttotalegreso]=useState(0)
    
    const [annoseleccionado,setAnnoseleccionado]=useState('')
    const [isFocusedanno, setIsFocusedanno] = useState(false);


    const [messeleccionado,setMesseleccionado]=useState('')
    
    const Cargaranno= (annotexto)=>{
        setAnnoseleccionado(annotexto)
        
      }
 

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
            
            const anno_storage=datestorage['dataanno']
            const body = {};
            const endpoint='MovileMisEgresos/' + anno_storage +'/0/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            const respuesta=result['resp']
            if (respuesta === 200){
                const registros=result['data']
                
                if(Object.keys(registros).length>0){
                    registros.forEach((elemento) => {
                      
                      elemento.key = elemento.id;
                      elemento.recarga='no'
                    })
                    
                    
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
            
           
            if(busqueda){
              
              
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
                      
                            
                        <View style={{ flexDirection:'row', marginLeft:20,alignContent:'center',marginTop:10}}>

                            <TextInput style={[{width:100,borderBottomWidth:2,color: colors.text,backgroundColor:colors.backgroundInpunt, 
                                                    borderBottomColor: isFocusedanno ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                        placeholder='Ingrese Año'
                                        placeholderTextColor='gray'
                                        value={annoseleccionado}
                                        onChangeText={annoseleccionado => Cargaranno(annoseleccionado)}
                                        onFocus={() => setIsFocusedanno(true)}
                                        onBlur={() => setIsFocusedanno(false)}
                                        underlineColorAndroid="transparent"
                                />
                            <View style={{flex:1, flexDirection: 'row', alignItems:'center',justifyContent:'center' }}>
                            
                                <Text style={[ 
                                            { 
                                            borderBottomWidth:2,
                                            // borderColor:'red',
                                            height:35,
                                            marginBottom:0,
                                            paddingTop:8,
                                            width:'60%',
                                            color: messeleccionado ? colors.text : 'gray',
                                            borderBottomColor: messeleccionado ? colors.textbordercoloractive : colors.textbordercolorinactive}]} 
                                >
                                {messeleccionado ? messeleccionado : 'Seleccione el mes..'}

                                
                                
                                </Text>
            
                                <TouchableOpacity 
                                style={styles.botonfecha} 
                                //   onPress={abrirgasto}
                                >         
                                <FontAwesome name="search-plus" size={30} color={colors.iconcolor} />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity 
                                style={styles.botonfecha} 
                                //   onPress={abrirgasto}
                                >         
                                <MaterialCommunityIcons name="page-next-outline" size={30} color={colors.iconcolor} />
                                </TouchableOpacity>
      
                      </View>

                      
                    {/* <View  style={styles.container}>

                          <FlatList 
                              data={dataegresos}
                              renderItem={({item}) =>{
                                  return(
                                      <TouchableOpacity  style={[styles.contenedordatos
                                                                ,{ 
                                                                  // borderColor : colors.bordercolor,
                                                                  borderRightColor: colors.bordercolor,
                                                                  borderBottomColor:'rgba(235,234,233,0.1)'
                                                                }]} 
                                      
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
                        
                    </View> */}


                    
                    {/* <View style={styles.resumencontainer}>

                        <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                          <Text style={styles.labeltext}>Cantidad Registros:</Text>{' '}
                            {Number(canttotalegreso).toLocaleString('es-ES')}
                        </Text>
                        <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                          <Text style={styles.labeltext}>Total Gasto:</Text>{' '}
                            {Number(montototalegreso).toLocaleString('es-ES')} Gs.
                        </Text>
                        
                    </View> */}

                  </View>
                    
                
            </SafeAreaView>
    
            
        )
    }




    
}
const styles = StyleSheet.create({
    
    inputtextactivo:{
        //borderBottomColor: 'rgb(44,148,228)', // Cambia el color de la línea inferior aquí
        borderBottomWidth: 2,
        //marginBottom:35,
        // paddingLeft:10
        
      },
      botonfecha:{
        width: 50, 
        height: 35, 
        paddingTop:5,
        marginLeft:'5%',
        //marginBottom:27
      },

  });
export default MovimientosEgreso