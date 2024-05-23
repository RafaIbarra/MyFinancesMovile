import React,{useState,useEffect,useContext } from "react";
import { View,Text, StyleSheet,FlatList } from "react-native";
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";
import { useTheme } from '@react-navigation/native';
import { AuthContext } from "../../AuthContext";

function Saldos ({ navigation  }){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { colors } = useTheme();
    const [cargacompleta,setCargacopleta]=useState(false)
    const [datadetalle,setDatadetalle]=useState([])
    const [guardando,setGuardando]=useState(false)
    const [ingresototal,setIngresototal]=useState(0)
    const [egresototal,setEgresototal]=useState(0)
    const [totalsaldo,setTotalsaldo]=useState(0)
    const [porcentaje,setPorcentaje]=useState('')

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setGuardando(true)
            const cargardatos=async()=>{
                const datestorage=await Handelstorage('obtenerdate');
                const anno_storage=datestorage['dataanno']

                const body = {};
                const endpoint='MovileSaldos/' + anno_storage +'/' 
                const result = await Generarpeticion(endpoint, 'POST', body);
                const respuesta=result['resp']
                if (respuesta === 200){
        
                    
                        const registros=result['data']
                        setDatadetalle(registros)
                        let totalgasto=0
                        let ingresos=0
                        let totalsaldo=0
                        registros.forEach(({ TotalIngreso, TotalEgreso,Saldo}) => {totalgasto += TotalEgreso,
                                        ingresos+=TotalIngreso, totalsaldo+=Saldo})
                        setEgresototal(totalgasto)
                        setIngresototal(ingresos)
                        setTotalsaldo(totalsaldo)
                    
                        const porcentajeglobal=totalsaldo*100/ingresos
                        setPorcentaje(porcentajeglobal.toFixed(2))
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


            <View style={[{ flexDirection:'row', marginLeft:2,marginTop:20,borderWidth:2,borderColor:colors.bordercolor,marginLeft:5,marginRight:5}]}>
                {guardando &&(<Procesando></Procesando>)}
                <View style={{width:'20%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                    <Text style={[ styles.textocontenido, { color:  colors.text,fontWeight:'bold' }]}>MES</Text>
                </View>

                <View style={{width:'22%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                    <Text style={[ styles.textocontenido, { color:  colors.text,fontWeight:'bold'}]}>INGRESO</Text>
                </View>

                <View style={{width:'22%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                    <Text style={[ styles.textocontenido, {color: colors.text,fontWeight:'bold' }]}>EGRESO</Text>
                </View>

                <View style={{width:'22%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                    <Text style={[ styles.textocontenido, { color:  colors.text,fontWeight:'bold' }]}>SALDO</Text>
                </View>
                
                <View style={{width:'15%',paddingBottom:10,paddingTop:10,paddingLeft:5,alignContent:'center',alignItems:'center'}}> 
                    <Text style={[ styles.textocontenido, { color:  colors.text,fontWeight:'bold' }]}>% </Text>
                </View>
                            
            </View>

            <View style={{borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:1,borderColor:'white',marginLeft:5,marginRight:5,maxHeight:'82%'}}>

                <FlatList
                    data={datadetalle}
                    renderItem={({ item }) => (
                        <View style={styles.contenedordatos}>

                            <View style={{width:'20%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                                <Text style={[ styles.textocontenido, { color: item.Saldo > 0  ? colors.text : 'rgb(255,115,96)'}]}>{item.NombreMesOperacion}</Text>
                            </View>

                            <View style={{width:'22%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                                <Text style={[ styles.textocontenido, { color: item.Saldo > 0  ? colors.text : 'rgb(255,115,96)'}]}>{Number(item.TotalIngreso).toLocaleString('es-ES')}</Text>
                            </View>
                            <View style={{width:'22%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                                <Text style={[ styles.textocontenido, {color: item.Saldo > 0  ? colors.text : 'rgb(255,115,96)'}]}>{Number(item.TotalEgreso).toLocaleString('es-ES')}</Text>
                            </View>
                            <View style={{width:'22%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                                <Text style={[ styles.textocontenido, { color: item.Saldo > 0  ? colors.text : 'rgb(255,115,96)'}]}>{Number(item.Saldo).toLocaleString('es-ES')}</Text>
                            </View>
                            <View style={{width:'15%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                                <Text style={[ styles.textocontenido, { color: item.Saldo > 0  ? colors.text : 'rgb(255,115,96)'}]}>{item.PorcentajeSaldo} % </Text>
                            </View>
                            
                        </View>
                    )}
                    keyExtractor={item => item.Periodo.toString()}
                    />
            </View>


            <View style={[{ flexDirection:'row', marginLeft:2,borderLeftWidth:2,borderRightWidth:2,borderBottomWidth:2,borderTopWidth:1,borderColor:colors.bordercolor,marginLeft:5,marginRight:5}]}>
            
                <View style={{width:'20%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                    <Text style={[ styles.textocontenido, { color:  colors.text,fontWeight:'bold' }]}>TOTALES </Text>
                </View>

                <View style={{width:'22%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                    <Text style={[ styles.textocontenido, { color: totalsaldo > 0  ? colors.text : 'rgb(255,115,96)',fontWeight:'bold'}]}>{Number(ingresototal).toLocaleString('es-ES')}</Text>
                </View>

                <View style={{width:'22%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                    <Text style={[ styles.textocontenido, {color: totalsaldo > 0  ? colors.text : 'rgb(255,115,96)',fontWeight:'bold' }]}>{Number(egresototal).toLocaleString('es-ES')}</Text>
                </View>

                <View style={{width:'22%',paddingBottom:10,paddingTop:10,paddingLeft:5}}> 
                    <Text style={[ styles.textocontenido, { color: totalsaldo > 0  ? colors.text : 'rgb(255,115,96)',fontWeight:'bold' }]}>{Number(totalsaldo).toLocaleString('es-ES')}</Text>
                </View>
                
                <View style={{width:'15%',paddingBottom:10,paddingTop:10,paddingLeft:5,alignContent:'center',alignItems:'center'}}> 
                    <Text style={[ styles.textocontenido, { color: totalsaldo > 0  ? colors.text : 'rgb(255,115,96)',fontWeight:'bold' }]}>{porcentaje}% </Text>
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
export default Saldos