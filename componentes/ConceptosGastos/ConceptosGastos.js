import React,{useState,useEffect,useContext,useRef,memo  } from "react";
import { useNavigation } from "@react-navigation/native";
import {  View,Text, StyleSheet,FlatList,TouchableOpacity,SafeAreaView,Animated,TextInput   } from "react-native";

import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";

import { AuthContext } from "../../AuthContext";
import { useTheme } from '@react-navigation/native';

/*Iconos*/
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


function ConceptosGastos ({ navigation  }){

    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);

    const [guardando,setGuardando]=useState(false)
    const [textobusqueda,setTextobusqueda]=useState('')
    
    const [rotationValue] = useState(new Animated.Value(0));
    const { colors } = useTheme();

    const [cargacompleta,setCargacopleta]=useState(false)
    const [dataingresos,setDataingresos]=useState([])
    const [dataingresoscompleto,setDataingresoscompleto]=useState([])
    const [montototalegreso,setMontototalegreso]=useState(0)
    const [canttotalegreso,setcanttotalegreso]=useState(0)
    const { navigate } = useNavigation();
    const [dataagrupado,setDataagrupado]=useState([])

    

    const [expandedGroup, setExpandedGroup] = useState(null);

    const toggleExpand = (index) => {
      if (expandedGroup === index) {
        setExpandedGroup(null);
      } else {
        setExpandedGroup(index);
      }
    };


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
        const concepto={'id':0,'nombre_gasto':'','tipogasto':0}
        navigate("ConceptosGastosRegistro", { concepto})
        
        
      };
    
      // Interpola el valor de rotación para aplicarlo al estilo de transformación del icono
    const spin = rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      } 
    );



    const realizarbusqueda= (palabra)=>{
      setTextobusqueda(palabra)
      const resultados = {};

      
      Object.entries(dataingresoscompleto).forEach(([grupo, gastos]) => {
        
        const gastosFiltrados = gastos.filter(gasto =>
          gasto.nombre_gasto.toLowerCase().includes(palabra.toLowerCase())
        );

        
        if (gastosFiltrados.length > 0) {
          resultados[grupo] = gastosFiltrados;
        }
      });
      
      setDataagrupado(resultados)

    }

   
   
    useEffect(() => {
        
            
            const cargardatos=async()=>{
                setGuardando(true)
                const body = {};
                const endpoint='MisGastos/0/'
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
                    
                    let totalegreso=0
                    let cantegreso=0
                    registros.forEach(({ TotalEgresos }) => {totalegreso += TotalEgresos,cantegreso+=1})
                    setMontototalegreso(totalegreso)
                    setcanttotalegreso(cantegreso)

                    const agrupado = registros.reduce((resultado, elemento) => {
                      // const clave = `${elemento.DescripcionCategoriaGasto}-${elemento.categoria}`;
                      const clave = elemento.DescripcionCategoriaGasto;
                      if (!resultado[clave]) {
                        resultado[clave] = [];
                      }
                      resultado[clave].push(elemento);
                      return resultado;
                    }, {});
                    
                    
                    setDataagrupado(agrupado)
                    setDataingresoscompleto(agrupado)
                    
                    
                }else if(respuesta === 403 || respuesta === 401){
                
                
                    await Handelstorage('borrar')
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    setActivarsesion(false)
                }
                setGuardando(false)
                setCargacopleta(true)

            
            }
            cargardatos()

         
        
    }, [estadocomponente.conceptosgastos]);
    
    const ConceptoItem = memo(({ concepto, navigate, colors }) => (
      <TouchableOpacity
        key={concepto.id}
        style={{
          flex: 1,
          marginHorizontal: 5,
          borderWidth: 1,
          borderTopLeftRadius: 10,
          borderColor: colors.bordercolor,
        }}
        onPress={() => navigate('ConceptosGastosDetalle', { concepto })}
      >
        
          <View style={{ alignContent:'center',
                         alignItems:'center' }}>
            
            <Text style={[styles.textoconcepto, { marginLeft: 5, fontSize:17,color: colors.text,paddingTop:5, paddingRight: 10,marginBottom:15 }]}>
              {concepto.nombre_gasto}
            </Text>
          </View>
          <View style={{marginLeft:10,paddingBottom:5}}>

              <Text style={[styles.textocontenido, { color: colors.text }]}> Categoria: {concepto.DescripcionCategoriaGasto}</Text>
        
              <Text style={[styles.textocontenido, { color: colors.text }]}>
              Acumulado:  {Number(concepto.TotalEgresos).toLocaleString('es-ES')} Gs.
              </Text>
              <Text style={[styles.textocontenido, { color: colors.text }]}> Tipo: {concepto.DescripcionTipoGasto}</Text>
          </View>
        
      </TouchableOpacity>
    ));
    
    

    return(
        <SafeAreaView style={{ flex: 1 }}>
            {guardando &&(<Procesando></Procesando>)}
            <View style={{ flex: 1 }}>    
                <View style={styles.cabeceracontainer}>

                    
                        
                    
                    <Text style={[styles.titulocabecera, { color: colors.text}]}>Conceptos Gastos</Text>

                    <TouchableOpacity style={[styles.botoncabecera,{ backgroundColor:colors.botoncolor}]} onPress={handlePress}>
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
                  data={Object.entries(dataagrupado)}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View key={item[0]}>
                      <View style={{borderTopWidth:2,
                                    borderRightWidth:2,
                                    borderLeftWidth:2,
                                    borderColor:'gray',
                                    padding:10,
                                    alignItems:'center',
                                    // borderRadius:20,
                                    borderTopLeftRadius:20,
                                    marginTop:10,
                                    backgroundColor:'rgba(0,0,0,0.6)',
                                    marginLeft:10,
                                    marginRight:10,
                                    flexDirection:'row',
                                    justifyContent:'space-between'
                                  }} 
                                    > 

                        <Text style={{ color: 'white',fontSize:17,fontWeight:'bold' }}>{item[0]}</Text>
                        <TouchableOpacity onPress={() => toggleExpand(index)} >

                        <AntDesign name={expandedGroup === index ? "caretup" : "caretdown"} size={24} color="white" />
                        </TouchableOpacity>
                      </View>
                      {expandedGroup === index && Array.isArray(item[1]) && item[1].length > 0 ? (
                        <FlatList
                          data={item[1]}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', marginBottom: 10, marginLeft: 5, marginRight: 5 }}>
                              <ConceptoItem
                                key={item.id}
                                concepto={item}
                                navigate={navigate}
                                colors={colors}
                              />
                            </View>
                          )}
                        />
                      ) : (
                        <Text></Text>
                      )}
                    </View>
                  )}
                />
            
                <View style={styles.resumencontainer}>

                    <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                        <Text style={styles.labeltext}>Cantidad Registros:</Text>{' '}
                        {Number(canttotalegreso).toLocaleString('es-ES')}
                    </Text>
                    <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                        <Text style={styles.labeltext}>Total Conceptos:</Text>{' '}
                        {Number(montototalegreso).toLocaleString('es-ES')} Gs.
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
      // color:'white'
    },
    textoconcepto:{
      fontSize:15,
      marginBottom:5,
      fontWeight:'bold',
      fontStyle:'italic'
      
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
  }

  });
export default ConceptosGastos