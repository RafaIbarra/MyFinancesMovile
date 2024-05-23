import React,{useState,useEffect,useContext } from "react";

import {  View,Text, StyleSheet,FlatList,TouchableOpacity,SafeAreaView,TextInput,Animated,Modal   } from "react-native";
import { StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import moment from 'moment';

import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";
import { useTheme } from '@react-navigation/native';
import { AuthContext } from "../../AuthContext";

function MovimientosIngresos ({ navigation  }){
    
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const [textobusqueda,setTextobusqueda]=useState('')
    const [guardando,setGuardando]=useState(false)
    const { colors } = useTheme();
    
    const [cargacompleta,setCargacopleta]=useState(false)
    const [dateegresoscompleto,setDateegresoscompleto]=useState([])
    const [dataegresos,setDataegresos]=useState([])

    const [optionmeses, setOptionmeses] = useState([]);
     
    const [annoseleccionado,setAnnoseleccionado]=useState('')
    const [isFocusedanno, setIsFocusedanno] = useState(false);


    const [messeleccionado,setMesseleccionado]=useState('')
    const [nombremesselccionado,setNombremesselccionado]=useState('')

    const [rotationValue] = useState(new Animated.Value(0));
    const [rotationValuereload] = useState(new Animated.Value(0));


    const [estadomodal,setEstadomodal]=useState(false)
    const [datamodal,setDatamodal]=useState([])
    const [datamodalcompleto,setDatamodalcompleto]=useState([])
    const [textobusquedamodal,setTextobusquedamodal]=useState('')
    const [isFocusemodal, setIsFocusedmodal] = useState(false);

    const realizarbusqueda= (palabra)=>{
      setTextobusqueda(palabra)
      const pal =palabra.toLowerCase()
      let arrayencontrado = dateegresoscompleto.filter(item => 
        item.NombreIngreso.toLowerCase().includes(pal) ||
        item.TipoIngreso.toLowerCase().includes(pal) ||
        item.anotacion.toLowerCase().includes(pal)
        );
      setDataegresos(arrayencontrado)
    }
    const toggleModal = () => {
      setEstadomodal(!estadomodal);
   
     };

     const seleccionopcionmodal=(itemsel)=>{
  
      setNombremesselccionado(itemsel.opcion)
      setMesseleccionado(itemsel.id)
      setDataegresos([])
      setDateegresoscompleto([])
      toggleModal()

    }
    const abrirmeses =()=>{
        
      toggleModal()
      // setModalplaceholder('Buscar Meses..')
      setDatamodal(datamodalcompleto)
      setTextobusquedamodal('')
      
    }

    const realizarbusquedamodal= (palabra)=>{
      setTextobusquedamodal(palabra)
      const pal =palabra.toLowerCase()
      let arrayencontrado = datamodalcompleto.filter(item => 
        item.opcion.toLowerCase().includes(pal)
        
        );
      setDatamodal(arrayencontrado)
    }


    const handlePress = () => {
        
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 200, // Duración de la animación en milisegundos
        useNativeDriver: true,
      }).start(() => {
        // Restaura la animación a su estado original
        rotationValue.setValue(0);
      });
     
      procesar()
    };

    const recargadatos = () => {
        
      Animated.timing(rotationValuereload, {
        toValue: 1,
        duration: 200, // Duración de la animación en milisegundos
        useNativeDriver: true,
      }).start(() => {
        // Restaura la animación a su estado original
        rotationValuereload.setValue(0);
      });
     
      setTextobusqueda('')
      setDataegresos(dateegresoscompleto)
    };

    const spin = rotationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    } 
    );

    const spinreload = rotationValuereload.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    } 
    );
    
    const Cargaranno= (annotexto)=>{
        setAnnoseleccionado(annotexto)
        
      }
 

 

    const procesar = async ()=>{
      setGuardando(true)
      const body = {};
      const endpoint='MovileMisIngresos/' + annoseleccionado +'/' + messeleccionado + '/'
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
              setGuardando(false)

          }
          
      }else if(respuesta === 403 || respuesta === 401){
          
          setGuardando(false)
          await Handelstorage('borrar')
          await new Promise(resolve => setTimeout(resolve, 1000))
          setActivarsesion(false)
      }
      
      
      

    }

    useEffect(() => {
      
        // setCargacopleta(false)
        const cargardatos=async()=>{
            
            const body = {};
            const endpoint='Meses/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            const respuesta=result['resp']
            if (respuesta === 200){
                const registros=result['data']
                
                
                setOptionmeses(registros.map(item => ({
                  opcion: item.nombre_mes,
                  id: item.id
                })));
                const listamesesopcion=registros.map(item => ({
                  opcion: item.nombre_mes,
                  id: item.id
                }))

                setDatamodalcompleto(listamesesopcion)
                setDatamodal(listamesesopcion);
                
                
               
                
            }else if(respuesta === 403 || respuesta === 401){
                
                
                await Handelstorage('borrar')
                await new Promise(resolve => setTimeout(resolve, 1000))
                setActivarsesion(false)
            }
            
           setCargacopleta(true)


           
        }
        cargardatos()
       
      
      
      }, []);

    if(cargacompleta){

        return(
            <SafeAreaView style={{ flex: 1 }}>
                {guardando &&(<Procesando></Procesando>)}

                
                    
                  <View style={{ flex: 1 }}>    
                      
                      <View style={{marginLeft:10,marginRight:10,padding:10,marginTop:10,borderWidth:1,borderColor:'gray',elevation:2}}>

                        <View style={{ flexDirection:'row',alignContent:'center'}}>

                              <TextInput style={[{width:80,marginBottom:2.6,borderBottomWidth:2,color: colors.text,backgroundColor:colors.backgroundInpunt, 
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
                                  {messeleccionado ? nombremesselccionado : 'Seleccione el mes..'}

                                  
    
                                  
                                  </Text>
              
                                  <TouchableOpacity 
                                  style={styles.botonfecha} 
                                  onPress={abrirmeses}
                                  >         
                                  <FontAwesome name="search-plus" size={30} color={colors.iconcolor} />
                                  </TouchableOpacity>
                              </View>

                              <TouchableOpacity 
                                  style={{width: 40, 
                                  height: 40, 
                                  borderRadius: 20, 
                                  justifyContent: 'center', 
                                  alignItems: 'center',
                                  backgroundColor:'rgb(218,165,32)'
                                }} 
                                onPress={handlePress}
                                  >
                                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                        <MaterialCommunityIcons name="database-arrow-down" size={30} color={colors.iconcolor} />
                                    </Animated.View>     
                              </TouchableOpacity>
        
                        </View>
                        <View style={{ flexDirection:'row',alignContent:'center'}}>

                            <TextInput style={{width:'86.4%',marginTop:20,borderBottomWidth:2,borderBottomColor:'white',height:40,color: colors.text}}
                                    placeholder="Buscar Concepto, Tipo o Anotacion.."
                                    placeholderTextColor={'gray'}
                                    underlineColorAndroid="transparent"
                                    value={textobusqueda}
                                    onChangeText={textobusqueda => realizarbusqueda(textobusqueda)}
                            >

                            </TextInput>

                            {
                              textobusqueda.length >0 && dataegresos.length >0 && (

                                <TouchableOpacity 
                                      style={{width: 40, 
                                      height: 40, 
                                      borderRadius: 20, 
                                      justifyContent: 'center', 
                                      alignItems: 'center',
                                      backgroundColor:'rgb(218,165,32)',
                                      marginTop:20,
                                      marginLeft:10
                                    }} 
                                    onPress={recargadatos}
                                      >
                                        <Animated.View style={{ transform: [{ rotate: spinreload }] }}>
                                            <MaterialCommunityIcons name="reload" size={30} color={colors.iconcolor} />
                                        </Animated.View>     
                                </TouchableOpacity>
                              )

                            }
                        </View>
                      </View>

                      
                    <View  style={{flex: 1,marginBottom:20,marginTop:20}}>

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
                                      
                                      //  onPress={() => {navigate('GastosDetalle', { item });}}
                                      
                                      >
                                          <View style={[styles.columna, { flex: 1 }]}> 

                                              <Text style={[styles.textocontenido,{ color: colors.text}]}> ID Transaccion: {item.id}</Text>
                                              <Text style={[styles.textototal,{ color: colors.text,fontWeight:'bold'}]}> Gs.: {Number(item.monto_ingreso).toLocaleString('es-ES')} </Text>
                                              <Text style={[styles.textocontenido,{ color: colors.text}]}> Tipo: {item.TipoIngreso}</Text>
                                              <Text style={[styles.textocontenido,{ color: colors.text}]}> Concepto: {item.NombreIngreso}</Text>
                                              <Text style={[styles.textocontenido,{ color: colors.text}]}> Fecha Ingreso: {moment(item.fecha_ingreso).format('DD/MM/YYYY')}</Text>
                                              <Text style={[styles.textocontenido,{ color: colors.text}]}> Fecha Registro: {moment(item.fecha_registro).format('DD/MM/YYYY HH:mm:ss')}</Text>
                                              <Text style={[styles.textocontenido,{ color: colors.text}]}> Anotacion: {item.anotacion}</Text>
                                              
                                              
                                              
                                              
                                          </View>

                                      
                                      </TouchableOpacity >
                                  )
                              }
                          }
                              keyExtractor={item => item.key}
                          />
                        
                    </View>


                    
                   

                  <Modal visible={estadomodal} 
                          transparent={true} 
                          onRequestClose={toggleModal}
                          animationType="slide" 
                          // animationDuration={2000}
                          >
                          <TouchableOpacity
                              style={styles.overlay}
                              activeOpacity={1}
                              onPress={toggleModal}
                          />

                          <View style={[styles.modalContainer,{backgroundColor:'rgb(28,44,52)'}]}>
                              <View style={{alignItems:'center',marginBottom:30,marginTop:5}}>
                                  <View style={{borderBottomWidth: 3,borderBottomColor: 'white',width:300,marginVertical: 10,}}></View>
                                  <View style={{borderBottomWidth: 1,borderBottomColor: 'white',width:250,marginVertical: 3,}}></View>
                                  <View></View>
                              </View>
                              <TextInput style={[{borderBottomWidth: 2,marginBottom:10,color: colors.text,backgroundColor:colors.backgroundInpunt, 
                                                  borderBottomColor: isFocusemodal ? colors.textbordercoloractive : colors.textbordercolorinactive }]}
                                  placeholder='Buscar mes..'
                                  placeholderTextColor='gray'
                                  value={textobusquedamodal}
                                  onChangeText={textobusquedamodal => realizarbusquedamodal(textobusquedamodal)}
                                  onFocus={() => setIsFocusedmodal(true)}
                                  onBlur={() => setIsFocusedmodal(false)}
                              > 
                                  
                              </TextInput>
                              <View style={{borderTopColor:colors.bordercolor,borderWidth:2,borderBottomLeftRadius:20,borderBottomRightRadius:20,marginTop:10,height:'70%'}} >
                                {
                                  datamodal && datamodal.length > 0 ?(

                                    <FlatList
                                    data={datamodal}
                                    renderItem={({item}) =>{
                                        return(
                                                <View style={{marginLeft:15,marginRight:15,borderBottomWidth:0.5,borderBottomColor:'white',marginBottom:10,padding:10}} >

                                                    <TouchableOpacity onPress={()=>seleccionopcionmodal(item)}>
                                                        <Text style={{color:colors.text}}>{item.opcion}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                )
                                        }
                                    }
                                    keyExtractor={item => item.id}

                                    />
                                  ) : (
                                        <View style={{alignContent:'center',alignItems:'center',marginTop:'20%'}}> 
                                          <Ionicons  name="warning" size={50} color="yellow" />
                                          <Text style={{
                                                        // color:'rgba(255,115,96,0.5)',
                                                        color:'rgba(255,255,255,0.6)',
                                                        fontSize:20}}> NO SE ENCONTRARON LOS MESES </Text>
                                        </View>
                                      )
                                }
                              </View>
                      
                          </View>
                  </Modal>

                  </View>
                    
                
            </SafeAreaView>
    
            
        )
    }




    
}
const styles = StyleSheet.create({
    

      botonfecha:{
        width: 50, 
        height: 35, 
        paddingTop:5,
        marginLeft:'5%',
        //marginBottom:27
      },

      modalContainer: {
    
        // padding: 20,
        paddingBottom:20,
        paddingLeft:20,
        paddingRight:20,
        position: 'absolute',
        bottom: 0,
        left: 5,
        right: 5,
        height:'50%',
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        borderLeftWidth:1,
        borderTopWidth:1,
        borderRightWidth:1,
        
        borderColor:'gray'
        },
    overlay: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },

    contenedordatos:{
          flexDirection: 'row',
          borderBottomWidth:1,
          borderRightWidth:3,
          marginBottom:10,
          marginRight:5,
  
          overflow: 'hidden', 
          // height: 130,
          padding: 10,
          
          
      },

  });
export default MovimientosIngresos