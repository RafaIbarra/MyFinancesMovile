import React,{useState,useEffect,useContext,useRef } from "react";
import {  View,Text, StyleSheet,FlatList,TouchableOpacity,SafeAreaView,Animated,TextInput   } from "react-native";
import { Divider } from 'react-native-paper';
import { useRoute } from "@react-navigation/native";
import { useTheme } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import { AuthContext } from "../../AuthContext";
import Procesando from "../Procesando/Procesando";
import moment from 'moment';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
function ResumenPeriodoAgrudado({ navigation  }){
    const { colors } = useTheme();
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);
    const { navigate } = useNavigation();
    const [codigo,setCodigo]=useState()
    const [titulo,setTitulo]=useState('')
    const [subtitulo,setSubtitulo]=useState()
    
    const [detallecomponente,setDetallecomponente]=useState([])
    const [valorbusqueda,setValorbusqueda]=useState()
    const [guardando,setGuardando]=useState(false) 
    const {params: { agrupacion },} = useRoute();
    const[montototal,setMontototal]=useState()
    const[canttotal,setcanttotal]=useState()

    const [labelmonto,setLabelmonto]=useState()
    const [labelcategoria,setLabelcategoria]=useState()
    const [labelconcepto,setLabelconcepto]=useState()
    const [labelfecha,setLabellabelfecha]=useState()
    const volver=()=>{
        navigation.goBack();
    }

    const cargaragrupacionconcepto= async (data)=>{
        setTitulo('Datos Egreso')
        setSubtitulo('Cat. Seleccionada: ')
        setValorbusqueda(agrupacion.Descripcion)
        setLabelcategoria('Categoria: ')
        setLabelconcepto('Concepto: ')
        data=estadocomponente.dataresumenconceptos
        setCodigo(agrupacion.Codigo)
        const valor=agrupacion.Descripcion.toLowerCase()
        let detalleFiltrado = data.filter(item => item.CategoriaGasto.toLowerCase()=== valor);
        
        const nuevoObjeto = detalleFiltrado.map((item,index) => ({
            id: index,
            key: item.key,
            CategoriaGasto: item.CategoriaGasto,
            NombreGasto: item.NombreGasto,
            fecha_gasto: '',
            fecha_registro: '',
            monto: item.MontoConcepto,
            CantidadReg:item.CantidadRegistros,
            tipo:'concepto',
            anotacion:''
            }));
        setDetallecomponente(nuevoObjeto)
        let totalgasto=0
        let cantgasto=0

        nuevoObjeto.forEach(({ monto,CantidadReg }) => {totalgasto += monto,cantgasto+=CantidadReg})
        setMontototal(totalgasto)
        setcanttotal(cantgasto)
    }

    const cargardetallebeneficios= async (data)=>{
        setTitulo('Datos Beneficios')
        setSubtitulo('Beneficios ')
        setValorbusqueda('')
        setLabelcategoria('Entidad: ')
        setLabelconcepto('Anotacion: ')
        setLabellabelfecha('Fecha Beneficio: ')
        
        setCodigo(agrupacion.Codigo)
        const valor=agrupacion.Descripcion.toLowerCase()
        // let detalleFiltrado = data.filter(item => item.CategoriaGasto.toLowerCase()=== valor);
        
        const nuevoObjeto = data.map((item) => ({
            id: item.id,
            key: item.id,
            CategoriaGasto: item.NombreEntidad,
            NombreGasto: item.anotacion,
            fecha_gasto: item.fecha_beneficio,
            fecha_registro: item.fecha_beneficio,
            monto: item.monto,
            CantidadReg:1,
            tipo:'beneficio',
            anotacion:item.anotacion
            }));
        setDetallecomponente(nuevoObjeto)
        let totalgasto=0
        let cantgasto=0
        nuevoObjeto.forEach(({ monto }) => {totalgasto += monto,cantgasto+=1})
        setMontototal(totalgasto)
        setcanttotal(cantgasto)
    }
    const cargardetalleingresos= async (data)=>{
        setTitulo('Datos Ingresos')
        setSubtitulo('Ingresos ')
        setValorbusqueda('')
        setLabelcategoria('Concepto: ')
        setLabelconcepto('Tipo: ')
        setLabellabelfecha('Fecha Ingreso: ')
        
        setCodigo(agrupacion.Codigo)
        const valor=agrupacion.Descripcion.toLowerCase()
        // let detalleFiltrado = data.filter(item => item.CategoriaGasto.toLowerCase()=== valor);
        
        const nuevoObjeto = data.map((item) => ({
            id: item.id,
            key: item.id,
            CategoriaGasto: item.NombreIngreso,
            NombreGasto: item.TipoIngreso,
            fecha_gasto: item.fecha_ingreso,
            fecha_registro: item.fecha_registro,
            monto: item.monto_ingreso,
            CantidadReg:1,
            tipo:'ingreso',
            anotacion:item.anotacion
            }));
        setDetallecomponente(nuevoObjeto)
        let totalgasto=0
        let cantgasto=0
        nuevoObjeto.forEach(({ monto }) => {totalgasto += monto,cantgasto+=1})
        setMontototal(totalgasto)
        setcanttotal(cantgasto)
    }
    useEffect(() => {
        
          const cargardatos=async()=>{
            setGuardando(true)
            
            
            if(agrupacion.Codigo===2){
                cargaragrupacionconcepto(agrupacion)
            }else{
                const datestorage=await Handelstorage('obtenerdate');
                const mes_storage=datestorage['datames']
                const anno_storage=datestorage['dataanno']
                let endpoint=''
                
                const body = {};
                if(agrupacion.Descripcion==='Beneficios'){
                    endpoint='MisMovimientosBeneficios/' + anno_storage +'/' + mes_storage + '/0/'

                }else{
                    endpoint='MovileMisIngresos/' + anno_storage +'/' + mes_storage + '/'
                }

                
                
                const result = await Generarpeticion(endpoint, 'POST', body);
                const respuesta=result['resp']
                
                if (respuesta === 200){
                    const registros=result['data']
                    

                    if(agrupacion.Descripcion==='Beneficios'){
                        await cargardetallebeneficios(registros)
    
                    }else{
                        
                        await cargardetalleingresos(registros)
                    }
                    
                    
                    
                }else if(respuesta === 403 || respuesta === 401){
                    
                    setGuardando(false)
                    await Handelstorage('borrar')
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    setActivarsesion(false)
                }


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
            {/* <Divider />
            <Divider /> */}


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
                            
                                                    onPress={() => {
                                                        if (codigo === 2) {
                                                          navigate('ResumenPeriodoDetalle', { detalle: item });
                                                        }
                                                      }}
                            
                            >
                                <View style={{flexDirection:'row',width:'100%'}}>

                                    <View style={{width:'85%'}}> 

                                        { codigo===1 ? <Text style={[styles.textocontenido,{ color: colors.text}]}> ID Transaccion: {item.id}</Text> :null}
                                        <Text style={[styles.textocontenido,{ color: colors.text}]}> {labelcategoria} {item.CategoriaGasto}</Text>
                                        <Text style={[styles.textocontenido,{ color: colors.text}]}> {labelconcepto} {item.NombreGasto}</Text>
                                        <Text style={[styles.textocontenido,{ color: colors.text,fontWeight:'bold'}]}> Gs. {Number(item.monto).toLocaleString('es-ES')} {labelmonto} </Text>
                                        { codigo===2 ? <Text style={[styles.textocontenido,{ color: colors.text}]}> Cantidad Registros: {Number(item.CantidadReg).toLocaleString('es-ES')}  </Text>:null}
                                        { codigo===1 ? <Text style={[styles.textocontenido,{ color: colors.text}]}> {labelfecha} {moment(item.fecha_gasto).format('DD/MM/YYYY')}</Text>: null}
                                        { codigo===1 ?<Text style={[styles.textocontenido,{ color: colors.text}]}> Fecha Registro: {moment(item.fecha_registro).format('DD/MM/YYYY HH:mm:ss')}</Text>: null}
                                        { codigo===1 ?<Text style={[styles.textocontenido,{ color: colors.text}]}> Anotacion: {item.anotacion}</Text>: null}

                                    </View>
                                    {
                                        codigo===2 &&(
                                            <View style={{marginTop:25,width:35,height: 35, borderRadius:50,backgroundColor:'white',justifyContent: 'center', alignItems: 'center',justifyContent:'center'}}>
                                        
                                                <FontAwesome6 name="circle-chevron-right" size={35} color={colors.subtitulo} />
                                                
                                            </View>
                                        )
                                    }
                                    
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

export default ResumenPeriodoAgrudado