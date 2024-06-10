import React,{useState,useEffect,useContext } from "react";
import {  View,Text, StyleSheet,FlatList   } from "react-native";
import {  Divider } from 'react-native-paper';
import {  ScrollView } from "react-native-gesture-handler";
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";
import { useTheme } from '@react-navigation/native';
import { AuthContext } from "../../AuthContext";
import AntDesign from '@expo/vector-icons/AntDesign'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

function ResumenPeriodo ({ navigation  }){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    
    const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);
    const [guardando,setGuardando]=useState(false)
    const { colors } = useTheme();
    const [cargacompleta,setCargacopleta]=useState(false)
    const [datadetalle,setDatadetalle]=useState([])
    const [ingresototal,setIngresototal]=useState(0)
    const [egresototal,setEgresototal]=useState(0)
    const [saldo,setSaldo]=useState(0)
    const [detallemedios,setDetallemedios]=useState([])
    const [montototalmedios,setMontototalmedios]=useState(0)
    const [cantidadtotalmedios,setCantidadtotalmedios]=useState(0)

    const [detalleconceptos,setDetalleconceptos]=useState([])
    const [montototalconceptos,setMontototalconceptos]=useState(0)
    const [cantidadtotalconceptos,setCantidadtotalconceptos]=useState(0)
    const cargarbalance=(data,resp)=>{
        let registros=[]
        if (resp===200){

            registros  = data.map((item, index) => {
                return {
                    ...item,
                    key: index
                };
                });
                actualizarEstadocomponente('dataresumen',registros)
        }else{
            registros=data
        }
        
        setDatadetalle(registros)
        
        let totalgasto=0
        let totalingreso=0
        registros.forEach(({ MontoIngreso, MontoEgreso}) => {totalgasto += MontoEgreso,totalingreso+=MontoIngreso})
        setEgresototal(totalgasto)
        setIngresototal(totalingreso)
        setSaldo(totalingreso - totalgasto)
    }

    const cargardatosmedios =(data,resp)=>{
        
        let registrosmedios=[]
        if (resp===200){
                registrosmedios = data_medios.map((item, index) => {
                return {
                    ...item,
                    key: 'm'+index
                };
                });
                actualizarEstadocomponente('dataresumenmedios',registrosmedios)
                
        }else{
            registrosmedios=data
        }
        
        
        setDetallemedios(registrosmedios)
        
        let totalmedio=0
        let totalcantidad=0
        registrosmedios.forEach(({ MontoMedio, CantidadRegistros}) => {totalmedio += MontoMedio,totalcantidad+=CantidadRegistros})
        setMontototalmedios(totalmedio)
        setCantidadtotalmedios(totalcantidad)
    }

    const cargardatosconceptos=(data,resp)=>{
        let registrosconceptos=[]
        if (resp===200){

            registrosconceptos = data_conceptos.map((item, index) => {
                return {
                    ...item,
                    key: 'c'+index
                };
                });
                actualizarEstadocomponente('dataresumenconceptos',registrosconceptos)
                
        }else{
            registrosconceptos=data
        }



        
        setDetalleconceptos(registrosconceptos)
        let totalconcepto=0
        let totalcantconceptos=0
        registrosconceptos.forEach(({ MontoConcepto, CantidadRegistros}) => {totalconcepto += MontoConcepto,totalcantconceptos+=CantidadRegistros})
        setMontototalconceptos(totalconcepto)
        setCantidadtotalconceptos(totalcantconceptos)

    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setGuardando(true)
            const cargardatos=async()=>{
                if (estadocomponente.compresumen){
                    
                    const datestorage=await Handelstorage('obtenerdate');
                    const mes_storage=datestorage['datames']
                    const anno_storage=datestorage['dataanno']

                    const body = {};
                    const endpoint='MovileResumenMes/' + anno_storage +'/' + mes_storage + '/'
                    const result = await Generarpeticion(endpoint, 'POST', body);
                    const respuesta=result['resp']
                    if (respuesta === 200){
            
                        
                        actualizarEstadocomponente('compresumen',false)

                        data_resumen=result['data']['resumen']
                        cargarbalance(data_resumen,respuesta)

                        data_medios=result['data']['medios']
                        cargardatosmedios(data_medios,respuesta)

                        data_conceptos=result['data']['conceptos']
                        cargardatosconceptos(data_conceptos,respuesta)

                        setGuardando(false)  
                        
                    }else if(respuesta === 403 || respuesta === 401){
                        
                        setGuardando(false)
                        await Handelstorage('borrar')
                        await new Promise(resolve => setTimeout(resolve, 1000))
                        setActivarsesion(false)
                    }

                }else{
                    
                    
                    cargarbalance(estadocomponente.dataresumen,0)
                    cargardatosmedios(estadocomponente.dataresumenmedios,0)
                    cargardatosconceptos(estadocomponente.dataresumenconceptos,0)
                }
                

                setGuardando(false)
                
                setCargacopleta(true)
        
                
            }
            cargardatos()
          // setRefresh(false)
        })
        return unsubscribe;
        }, [estadocomponente.compresumen,actualizarEstadocomponente,navigation]);
    

    return(
    <ScrollView>
        {guardando &&(<Procesando></Procesando>)}

        

        {cargacompleta && (

        <View>


            <View style={{height:40, backgroundColor:colors.subtitulo,alignContent:'center',justifyContent:'center',marginLeft:5,marginRight:5,borderTopLeftRadius:5,borderTopRightRadius:5,
                        borderWidth:0.3,borderColor:colors.bordercolor}}>

                        <Text style={{ color: colors.text,marginLeft:20,fontWeight:'bold'}}>BALANCE DEL MES</Text>
            </View>
            <View style={[{ flexDirection:'row', marginLeft:2,borderWidth:2,borderColor:colors.bordercolor,marginLeft:5,marginRight:5}]}>

                            <View style={{width:'45%',paddingBottom:10,paddingTop:10,paddingLeft:5,alignContent:'center',alignItems:'center'}}> 
                                <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>CONCEPTO</Text>
                            </View>

                            <View style={{width:'21.8%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                                <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>INGRESO </Text>
                            </View>
                            <View style={{width:'22.5%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                                <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>EGRESO</Text>
                            </View>
                            
            </View>
            <ScrollView style={{maxHeight:300,borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:1,borderColor:'white',marginLeft:5,marginRight:5}}>
                {Object.keys(datadetalle).map((key) => (
                                       

                    <View style={styles.contenedordatos} key={key}>
                            <View style={{width:'45%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text}]}>{datadetalle[key].Descripcion}</Text>
                        </View>

                        <View style={{width:'22.5%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text,}]}>{Number(datadetalle[key].MontoIngreso).toLocaleString('es-ES')}</Text>
                        </View>
                        <View style={{borderRightWidth:0.5,borderRightColor:'white',width:'22.5%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text}]}>{Number(datadetalle[key].MontoEgreso).toLocaleString('es-ES')}</Text>
                        </View>
                        <View style={{width:'12%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 

                            <View style={{borderWidth:2,borderColor:'white',marginLeft:2,width:22,borderRadius:100,backgroundColor:'white',alignItems:'center'}}> 

                                    {/* <AntDesign name= { datadetalle[key].MontoIngreso > 0 ? "upcircle": "downcircle" } size={18} color={ datadetalle[key].MontoIngreso > 0 ? "green": "rgb(255,115,96)" } /> */}
                                    {datadetalle[key].MontoEgreso === 0 && datadetalle[key].MontoIngreso === 0 ? (
                                        <AntDesign name="minuscircle" size={18} color="rgb(218,165,32)" />
                                        ) : (
                                        <AntDesign
                                            name={datadetalle[key].MontoIngreso > 0 ? "upcircle" : "downcircle"}
                                            size={18}
                                            color={
                                            datadetalle[key].MontoIngreso > 0 ? "green" : "rgb(255,115,96)"
                                            }
                                        />
                                    )}
                            </View>
                        </View>
                    </View>

                ))}
            </ScrollView>
            <View style={{marginLeft:2,borderRightWidth:2,borderLeftWidth:2,borderBottomLeftRadius:15,borderBottomRightRadius:15,borderBottomWidth:2,borderColor:colors.bordercolor,marginLeft:5,marginRight:5,marginBottom:25}}>

                <View style={[{ flexDirection:'row',borderBottomWidth:0.5,borderBottomColor: colors.bordercolor}]}>

                    <View style={{width:'45%',paddingBottom:10,paddingTop:10,paddingLeft:5,alignContent:'center',alignItems:'center'}}> 
                        <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>TOTALES {'>>>>>>>>>>>>>>'}</Text>
                    </View>

                    <View style={{width:'21.8%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                        <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>{Number(ingresototal).toLocaleString('es-ES')} </Text>
                    </View>
                    <View style={{width:'22.5%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                        <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>{Number(egresototal).toLocaleString('es-ES')}</Text>
                    </View>
                                
                </View>
                <View style={{margin:10,alignContent:'center',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                        <Text style={[ { color: colors.text,fontWeight:'bold',marginRight:10,fontSize:15,}]}>SALDO :</Text>
                        <Text style={[ 
                                    { color: saldo >0 ? colors.text :'rgb(255,115,96)',
                                    fontSize:15,
                                    fontWeight:'bold'}]}
                                    >
                                    {Number(saldo).toLocaleString('es-ES')}
                        </Text>
                </View>
            </View>

            <Divider />


            <View style={{height:40, backgroundColor:colors.subtitulo,marginTop:25,alignContent:'center',justifyContent:'center',marginLeft:5,marginRight:5,borderTopLeftRadius:5,borderTopRightRadius:5,
                        borderWidth:0.3,borderColor:colors.bordercolor}}>

                        <Text style={{ color: colors.text,marginLeft:20,fontWeight:'bold'}}>MEDIOS DE PAGOS</Text>
            </View>
            <View style={[{ flexDirection:'row', marginLeft:2,borderWidth:2,borderColor:colors.bordercolor,marginLeft:5,marginRight:5}]}>

                            <View style={{width:'55%',paddingBottom:10,paddingTop:10,paddingLeft:5,alignContent:'center',alignItems:'center'}}> 
                                <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>MEDIO PAGO</Text>
                            </View>

                            <View style={{width:'30%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                                <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>TOTAL </Text>
                            </View>
                            <View style={{width:'15%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                                <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>CANT</Text>
                            </View>
                            
            </View>
            <ScrollView style={{maxHeight:300,borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:1,borderColor:'white',marginLeft:5,marginRight:5}}>
                {Object.keys(detallemedios).map((key) => (
                                       

                    <View style={styles.contenedordatos} key={key}>
                        <View style={{width:'55%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text}]}>{detallemedios[key].MedioPago}</Text>
                        </View>

                        <View style={{width:'30%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text,}]}>{Number(detallemedios[key].MontoMedio).toLocaleString('es-ES')}</Text>
                        </View>
                        <View style={{width:'15%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text}]}>{Number(detallemedios[key].CantidadRegistros).toLocaleString('es-ES')}</Text>
                        </View>
                        
                    </View>

                ))}
            </ScrollView>
            <View style={{marginLeft:2,borderRightWidth:2,borderLeftWidth:2,borderBottomWidth:2,borderColor:colors.bordercolor,marginLeft:5,marginRight:5,borderBottomLeftRadius:15,borderBottomRightRadius:15,marginBottom:25}}>

                    <View style={[{ flexDirection:'row'}]}>

                        <View style={{width:'55%',paddingBottom:10,paddingTop:10,paddingLeft:5,alignContent:'center',alignItems:'center'}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>TOTALES {'>>>>>>>>>>>>>>'}</Text>
                        </View>

                        <View style={{width:'30%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>{Number(montototalmedios).toLocaleString('es-ES')} </Text>
                        </View>
                        <View style={{width:'22.5%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>{Number(cantidadtotalmedios).toLocaleString('es-ES')}</Text>
                        </View>
                                    
                    </View>
                    
            </View>

            <Divider />
            


            <View style={{height:40, backgroundColor:colors.subtitulo,marginTop:25,alignContent:'center',justifyContent:'center',marginLeft:5,marginRight:5,borderTopLeftRadius:5,borderTopRightRadius:5,
                        borderWidth:0.3,borderColor:colors.bordercolor}}>

                        <Text style={{ color: colors.text,marginLeft:20,fontWeight:'bold'}}>RESUMEN POR CONCEPTOS</Text>
            </View>
            <View style={[{ flexDirection:'row', marginLeft:2,borderWidth:2,borderColor:colors.bordercolor,marginLeft:5,marginRight:5}]}>

                            <View style={{width:'55%',paddingBottom:10,paddingTop:10,paddingLeft:5,alignContent:'center',alignItems:'center'}}> 
                                <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>CONCEPTO</Text>
                            </View>

                            <View style={{width:'30%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                                <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>MONTO </Text>
                            </View>
                            <View style={{width:'15%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                                <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>CANT</Text>
                            </View>
                            
            </View>
            <ScrollView style={{maxHeight:300,borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:1,borderColor:'white',marginLeft:5,marginRight:5}}>
                {Object.keys(detalleconceptos).map((key) => (
                                    

                    <View style={styles.contenedordatos} key={key}>
                        <View style={{width:'55%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text}]}>{detalleconceptos[key].NombreGasto}</Text>
                        </View>

                        <View style={{width:'30%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text,}]}>{Number(detalleconceptos[key].MontoConcepto).toLocaleString('es-ES')}</Text>
                        </View>
                        <View style={{width:'15%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text}]}>{Number(detalleconceptos[key].CantidadRegistros).toLocaleString('es-ES')}</Text>
                        </View>
                        
                    </View>

                ))}
            </ScrollView>
            <View style={{marginLeft:2,borderRightWidth:2,borderLeftWidth:2,borderBottomWidth:2,borderColor:colors.bordercolor,marginLeft:5,marginRight:5,borderBottomLeftRadius:15,borderBottomRightRadius:15,marginBottom:20}}>

                    <View style={[{ flexDirection:'row'}]}>

                        <View style={{width:'55%',paddingBottom:10,paddingTop:10,paddingLeft:5,alignContent:'center',alignItems:'center'}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>TOTALES {'>>>>>>>>>>>>>>'}</Text>
                        </View>

                        <View style={{width:'30%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>{Number(montototalconceptos).toLocaleString('es-ES')} </Text>
                        </View>
                        <View style={{width:'22.5%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text,fontWeight:'bold'}]}>{Number(cantidadtotalconceptos).toLocaleString('es-ES')}</Text>
                        </View>
                                    
                    </View>
                    
            </View>
    

            

        </View>
        )}

            
        

    </ScrollView>
    )
        

}

const styles = StyleSheet.create({

    textocontenido:{
      fontSize:12.5,

      alignContent:'flex-start',

    },


  contenedordatos:{
        flexDirection: 'row',
        
        overflow: 'hidden', 
        
        borderBottomWidth:0.5,
        borderColor:'white',
        // padding:10,

        
    },
 



  });

export default ResumenPeriodo