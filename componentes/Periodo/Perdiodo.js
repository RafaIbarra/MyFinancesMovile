import React,{useState,useEffect,useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {  View,Text,TouchableOpacity,FlatList } from "react-native";
import { Button} from 'react-native-paper';
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import { AuthContext } from "../../AuthContext";
import { useTheme } from '@react-navigation/native';
/*Iconos*/
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Procesando from "../Procesando/Procesando";
function Periodo({navigation}){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const {periodo, setPeriodo} = useContext(AuthContext);
    const { colors } = useTheme();
    const { navigate } = useNavigation();
    const [cargacompleta,setCargacopleta]=useState(false)
    const [guardando,setGuardando]=useState(false)

    const [meses,setMeses]=useState([])
    const [numeromesactual,setNumeromesactual]=useState(0)
    const [mesactual,setMesactual]=useState('')
    const [expandedMes,setExpandedMes]=useState(false)

    const [annoactual,setAnnoactual]=useState(0)
    const [listannos,setListaanos]=useState([])
    const [expandedAno,setExpandedAno]=useState(false)

    const seleccionarmes =(item)=>{
        setNumeromesactual(item.id)
        setMesactual(item.nombre_mes)
        setExpandedMes(!expandedMes)
    }
    const toggleExpandMes=()=>{
        setExpandedMes(!expandedMes)
    }


    const seleccionaranno =(item)=>{
        setAnnoactual(item.ano)
        
        setExpandedAno(!expandedAno)
    }
    const toggleExpandAno=()=>{
        setExpandedAno(!expandedAno)
    }

    const procesar = async ()=>{
        setGuardando(true)
        const datadate={
            datames:numeromesactual,
            dataanno:annoactual,
            dataperiodo:mesactual +'-' + annoactual
          }
        
        await Handelstorage('actualizardate',datadate)
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        setPeriodo(mesactual +'-' + annoactual)
        setGuardando(false)
        navigate("Gastos")
    }

    useEffect(() => {
      
        // setCargacopleta(false)
        const cargardatos=async()=>{
            
            const body = {};
            const endpoint='Meses/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            const respuesta=result['resp']
            const datestorage=await Handelstorage('obtenerdate');
            const mes_storage=datestorage['datames']
            setNumeromesactual(mes_storage)
            const anno_storage=datestorage['dataanno']
            if (respuesta === 200){
                const registros=result['data']
                setMeses(registros)
                
                
                const nombremes=registros.find(mesObj => mesObj.id === mes_storage)
                setMesactual(nombremes.nombre_mes)
                setAnnoactual(anno_storage)
                const anosArray = [];
                for (let i = 0; i <= 5; i++) {
                    anosArray.push({ ano: anno_storage + i });
                  }
                
                setListaanos(anosArray)
                
            }else if(respuesta === 403 || respuesta === 401){
                
                
                await Handelstorage('borrar')
                await new Promise(resolve => setTimeout(resolve, 1000))
                setActivarsesion(false)
            }
            
           setCargacopleta(true)
            
            // setBusqueda(false)
            // setTextobusqueda('')

           
        }
        cargardatos()
        // setRefresh(false)
      
      
      }, []);
    if(cargacompleta){
        return(
    
            <View style={{ flex: 1 }}>
                {guardando &&(<Procesando></Procesando>)}
                <View style={{}}>

                        <View style={{flexDirection:'row',marginBottom:100,marginTop:100,alignContent:'center',
                        alignContent:'center',justifyContent:'space-between',marginRight:50}}> 

                            <View style={{marginLeft:10,marginTop:20}}>

                                <View style={{flexDirection: 'row',marginLeft:10}}>
                                            
                                    <Text style={[ 
                                                    { 
                                                    borderBottomWidth:2,
                                                    // borderColor:'red',
                                                    height:35,
                                                    marginBottom:0,
                                                    paddingTop:8,
                                                    paddingLeft:10,
                                                    width:'60%',
                                                    color: mesactual ? colors.text : 'gray',
                                                    borderBottomColor: mesactual ? colors.textbordercoloractive : colors.textbordercolorinactive}]} 
                                        >
                                        {mesactual ? mesactual : 'Seleccione el mes..'}
                                    </Text>
                    
                                    <TouchableOpacity onPress={() => toggleExpandMes()} style={{paddingTop:10}}>

                                        <AntDesign name={expandedMes ? "caretup" : "caretdown"} size={24} color="white" />
                                    </TouchableOpacity>
                                    
                                </View>
                                {
                                    expandedMes &&(
                                        <View style={{borderLeftWidth:1,borderRightWidth:1,
                                                    borderBottomWidth:1,borderColor:'gray',width:'60%',
                                                    borderBottomLeftRadius:20,borderBottomRightRadius:20
                                                    ,maxHeight:300,marginLeft:10}}>
                                            
                                            <FlatList
                                                data={meses}
                                                renderItem={({item}) =>{
                                                    return(
                                                            <View style={{marginLeft:15,marginRight:15,borderBottomWidth:0.5,borderBottomColor:'white',marginBottom:10,padding:10}} >

                                                                <TouchableOpacity onPress={() => seleccionarmes(item)}>
                                                                    <Text style={{color:colors.text}}>{item.nombre_mes}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            )
                                                    }
                                                }
                                                keyExtractor={item => item.id}

                                                />
                                        </View>
                                    )
                                }
                            </View>

                            <View style={{marginLeft:10,marginTop:20}}>

                                <View style={{flexDirection: 'row',marginLeft:10}}>
                                                
                                        <Text style={[ 
                                                        { 
                                                        borderBottomWidth:2,
                                                        // borderColor:'red',
                                                        height:35,
                                                        marginBottom:0,
                                                        paddingTop:8,
                                                        paddingLeft:10,
                                                        width:'50%',
                                                        color: annoactual ? colors.text : 'gray',
                                                        borderBottomColor: annoactual ? colors.textbordercoloractive : colors.textbordercolorinactive}]} 
                                            >
                                            {annoactual ? annoactual : 'Seleccione el año..'}
                                        </Text>
                        
                                        <TouchableOpacity onPress={() => toggleExpandAno()} style={{paddingTop:10}}>

                                            <AntDesign name={expandedAno ? "caretup" : "caretdown"} size={24} color="white" />
                                        </TouchableOpacity>
                                        
                                </View>
                                {
                                    expandedAno &&(
                                            <View style={{borderLeftWidth:1,borderRightWidth:1,
                                                        borderBottomWidth:1,borderColor:'gray',width:'50%',
                                                        borderBottomLeftRadius:20,borderBottomRightRadius:20
                                                        ,maxHeight:300,marginLeft:10}}>
                                                
                                                <FlatList
                                                    data={listannos}
                                                    renderItem={({item}) =>{
                                                        return(
                                                                <View style={{marginLeft:15,marginRight:15,borderBottomWidth:0.5,borderBottomColor:'white',marginBottom:10,padding:10}} >

                                                                    <TouchableOpacity onPress={() => seleccionaranno(item)}>
                                                                        <Text style={{color:colors.text}}>{item.ano}</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                                )
                                                        }
                                                    }
                                                    keyExtractor={item => item.ano}

                                                    />
                                            </View>
                                        )
                                }
                            </View>
                        </View>

                        <Button 
                            style={{marginBottom:10,marginLeft:10,marginRight:10,backgroundColor:'rgba(44,148,228,0.7)'}} 
                            
                            icon={() => {
                                return <MaterialCommunityIcons name="content-save-check" size={30} color="white" />
                            }}
                            mode="elevated" 
                            textColor="white"
                            onPress={procesar}>
                            PROCESAR 
                        </Button>
                </View>
            </View>
    
        )
    }
        
}
export default Periodo