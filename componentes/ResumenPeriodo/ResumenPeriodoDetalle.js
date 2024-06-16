import React,{useState,useEffect,useContext,useRef } from "react";
import {  View,Text, StyleSheet,FlatList,TouchableOpacity,SafeAreaView,Animated,TextInput   } from "react-native";
import { Divider } from 'react-native-paper';
import { useRoute } from "@react-navigation/native";
import { useTheme } from '@react-navigation/native';
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import { AuthContext } from "../../AuthContext";
import Procesando from "../Procesando/Procesando";
import moment from 'moment';
import Ionicons from '@expo/vector-icons/Ionicons';
function ResumenPeriodoDetalle({ navigation  }){
    const { colors } = useTheme();
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const [titulo,setTitulo]=useState('')
    const [subtitulo,setSubtitulo]=useState()
    const [labelmonto,setLabelmonto]=useState()
    const [detallecomponente,setDetallecomponente]=useState([])
    const [valorbusqueda,setValorbusqueda]=useState()
    const [guardando,setGuardando]=useState(false) 
    const {params: { detalle },} = useRoute();
    const[montototal,setMontototal]=useState()
    const[canttotal,setcanttotal]=useState()
    const volver=()=>{
        navigation.goBack();
    }
    const cargardetallemedio = async (data)=>{
        setTitulo('Detalle Medio Pago')
        setSubtitulo('Medio Seleccionado: ')
        setValorbusqueda(detalle.MedioPago)
        setLabelmonto('(Según Medio Sel.)')
        const valor=detalle.MedioPago.toLowerCase()
            const detalleFiltrado = data.filter(item =>
                item.Distribucion.some(
                    distribucion => distribucion.descripcionmedio.toLowerCase() === valor
                )
                )
            

            const nuevoObjeto = detalleFiltrado.map(item => ({
                id: item.id,
                key: item.id,
                CategoriaGasto: item.CategoriaGasto,
                NombreGasto: item.NombreGasto,
                fecha_gasto: item.fecha_gasto,
                fecha_registro: item.fecha_registro,
                monto: item.Distribucion.find(distribucion => distribucion.descripcionmedio.toLowerCase() === valor).monto,
                anotacion:item.anotacion

                }));

            let totalgasto=0
            let cantgasto=0
            nuevoObjeto.forEach(({ monto }) => {totalgasto += monto,cantgasto+=1})
            setMontototal(totalgasto)
            setcanttotal(cantgasto)
            setDetallecomponente(nuevoObjeto)
    }
    const cargardetalleconcepto = async (data)=>{
        setTitulo('Detalle Concepto')
        setSubtitulo('Concepto Seleccionado: ')
        setValorbusqueda(detalle.NombreGasto)
        setLabelmonto('(Total Gasto.)')
        const valor=detalle.NombreGasto.toLowerCase()
            

            let detalleFiltrado = data.filter(item => 
                    item.NombreGasto.toLowerCase()=== valor
                    
                    );
            

            const nuevoObjeto = detalleFiltrado.map(item => ({
                id: item.id,
                key: item.id,
                CategoriaGasto: item.CategoriaGasto,
                NombreGasto: item.NombreGasto,
                fecha_gasto: item.fecha_gasto,
                fecha_registro: item.fecha_registro,
                monto: item.monto_gasto,
                anotacion:item.anotacion
                }));

            let totalgasto=0
            let cantgasto=0
            nuevoObjeto.forEach(({ monto }) => {totalgasto += monto,cantgasto+=1})
            setMontototal(totalgasto)
            setcanttotal(cantgasto)
            setDetallecomponente(nuevoObjeto)
    }
    useEffect(() => {
        
          const cargardatos=async()=>{
            setGuardando(true)
            
            
            const datestorage=await Handelstorage('obtenerdate');
            const mes_storage=datestorage['datames']
            const anno_storage=datestorage['dataanno']
            
            const body = {};
            const endpoint='MovileMisEgresos/' + anno_storage +'/' + mes_storage + '/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            const respuesta=result['resp']
            
            if (respuesta === 200){
                const registros=result['data']


                if(detalle.tipo==='medio'){
                    await cargardetallemedio(registros)
                }
                if(detalle.tipo==='concepto'){
                    await cargardetalleconcepto(registros)
                }
                
                
            }else if(respuesta === 403 || respuesta === 401){
                
                setGuardando(false)
                await Handelstorage('borrar')
                await new Promise(resolve => setTimeout(resolve, 1000))
                setActivarsesion(false)
            }
            setGuardando(false)
              
              
             
           
  
             
          }
          
          cargardatos()
          
        
  
        }, []);

    return(
        <View style={{ flex: 1 }}>
            {guardando &&(<Procesando></Procesando>)}
            
            <View style={styles.cabeceracontainer}>
                <TouchableOpacity style={{}} onPress={volver}>
                          
                    {/* <FontAwesome name="search" size={24} color={colors.iconcolor}/> */}
                    <Ionicons name="arrow-back" size={25} color="white" />
                          
                </TouchableOpacity>
                <Text style={{marginLeft:60,fontSize: 20,fontWeight: 'bold',textAlign: 'center', color: colors.text}}>{titulo}</Text>
            </View>
            <View style={{backgroundColor:colors.subtitulo,height:45,alignContent:'center',marginRight:5,justifyContent:'center',marginBottom:2}}>
                <Text style={{marginLeft:10,fontSize: 18,fontWeight: 'bold',textAlign: 'left', color: colors.text}}> {subtitulo} {valorbusqueda}</Text>
            </View>
            {/* <Divider /> */}
            {/* <Divider /> */}


            <View style={styles.container}>

                <FlatList 
                    data={detallecomponente}
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
                                <View style={[styles.columna, { flex: 2 }]}> 

                                    <Text style={[styles.textocontenido,{ color: colors.text}]}> ID Transaccion: {item.id}</Text>
                                    <Text style={[styles.textocontenido,{ color: colors.text,fontWeight:'bold'}]}> Gs. {Number(item.monto).toLocaleString('es-ES')} {labelmonto} </Text>
                                    <Text style={[styles.textocontenido,{ color: colors.text}]}> Categoria: {item.CategoriaGasto}</Text>
                                    <Text style={[styles.textocontenido,{ color: colors.text}]}> Concepto: {item.NombreGasto}</Text>
                                    <Text style={[styles.textocontenido,{ color: colors.text}]}> Fecha Gasto: {moment(item.fecha_gasto).format('DD/MM/YYYY')}</Text>
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
            <View style={styles.resumencontainer}>

                <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                <Text style={styles.labeltext}>Cantidad Registros:</Text>{' '}
                    {Number(canttotal).toLocaleString('es-ES')}
                </Text>
                <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                <Text style={styles.labeltext}>Total Gasto:</Text>{' '}
                    {Number(montototal).toLocaleString('es-ES')} Gs.
                </Text>

            </View>
        </View>
    )

}
const styles = StyleSheet.create({
   
    
    cabeceracontainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignContent:'flex-start',
        // justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: 1,

        
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
        // height: 150,
        paddingLeft:15,
        paddingTop:10,
        paddingBottom:10
        
        
    },
    textocontenido:{
        fontSize:12.5,
        marginBottom:6,
        // color:'white'
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
   
})

export default ResumenPeriodoDetalle