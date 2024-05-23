import React,{useState,useEffect,useContext } from "react";
import {  View,Text, StyleSheet,FlatList   } from "react-native";
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";
import { useTheme } from '@react-navigation/native';
import { AuthContext } from "../../AuthContext";
import AntDesign from '@expo/vector-icons/AntDesign'

function ResumenPeriodo ({ navigation  }){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const [guardando,setGuardando]=useState(false)
    const { colors } = useTheme();
    const [cargacompleta,setCargacopleta]=useState(false)
    const [datadetalle,setDatadetalle]=useState([])
    const [ingresototal,setIngresototal]=useState(0)
    const [egresototal,setEgresototal]=useState(0)
    const [saldo,setSaldo]=useState(0)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setGuardando(true)
            const cargardatos=async()=>{
                const datestorage=await Handelstorage('obtenerdate');
                const mes_storage=datestorage['datames']
                const anno_storage=datestorage['dataanno']

                const body = {};
                const endpoint='MovileResumenMes/' + anno_storage +'/' + mes_storage + '/'
                const result = await Generarpeticion(endpoint, 'POST', body);
                const respuesta=result['resp']
                if (respuesta === 200){
        
                    
                    registros=result['data']
                    setDatadetalle(registros)
                    let totalgasto=0
                    let totalingreso=0
                    registros.forEach(({ MontoIngreso, MontoEgreso}) => {totalgasto += MontoEgreso,totalingreso+=MontoIngreso})
                    setEgresototal(totalgasto)
                    setIngresototal(totalingreso)
                    setSaldo(totalingreso - totalgasto)
                    setGuardando(false)  
                    
                }else if(respuesta === 403 || respuesta === 401){
                    
                    setGuardando(false)
                    await Handelstorage('borrar')
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    setActivarsesion(false)
                }
                
                setCargacopleta(true)
        
                
            }
            cargardatos()
          // setRefresh(false)
        })
        return unsubscribe;
        }, [navigation]);
    

    return(
    <View>
        {guardando &&(<Procesando></Procesando>)}

        <View style={[{ flexDirection:'row', marginLeft:2,marginTop:50,borderWidth:2,borderColor:colors.bordercolor,marginLeft:5,marginRight:5}]}>

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

        <View style={{borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:1,borderColor:'white',marginLeft:5,marginRight:5,maxHeight:'63%'}}>

            <FlatList
                data={datadetalle}
                renderItem={({ item }) => (
                    <View style={styles.contenedordatos}>

                        <View style={{width:'45%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text}]}>{item.Descripcion}</Text>
                        </View>

                        <View style={{width:'22.5%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text,}]}>{Number(item.MontoIngreso).toLocaleString('es-ES')}</Text>
                        </View>
                        <View style={{borderRightWidth:0.5,borderRightColor:'white',width:'22.5%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                            <Text style={[ styles.textocontenido, { color: colors.text}]}>{Number(item.MontoEgreso).toLocaleString('es-ES')}</Text>
                        </View>
                        <View style={{width:'12%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 

                            <View style={{borderWidth:2,borderColor:'white',marginLeft:2,width:22,borderRadius:100,backgroundColor:'white',alignItems:'center'}}> 

                                    <AntDesign name= { item.MontoIngreso > 0 ? "upcircle": "downcircle" } size={18} color={ item.MontoIngreso > 0 ? "green": "rgb(255,115,96)" } />
                            </View>
                        </View>
                    </View>
                )}
                keyExtractor={item => item.Descripcion.toString()}
                />
        </View>
        <View style={{marginLeft:2,borderRightWidth:2,borderLeftWidth:2,borderBottomWidth:2,borderColor:colors.bordercolor,marginLeft:5,marginRight:5}}>

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
    </View>
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