import React,{useState,useEffect,useContext} from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {  View,Text,StyleSheet,TouchableOpacity } from "react-native";
import {  Portal,  PaperProvider,Dialog,Button,Divider } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";
import { AuthContext } from "../../AuthContext";

import moment from 'moment';
import { useTheme } from '@react-navigation/native';
function GastosDetalle ({ navigation }){
    const { actualizargastos, setActualizargastos } = useContext(AuthContext);
    const { actualizarresumen, setActualizarresumen } = useContext(AuthContext);
    const {actualizarsaldos,setActualizarsaldos}=useContext(AuthContext)
    const { updstastsaldo, setUpdstastsaldo } = useContext(AuthContext);
    const {params: { item },} = useRoute();
    const [guardando,setGuardando]=useState(false)
    const { colors } = useTheme();
    const [visibledialogo, setVisibledialogo] = useState(false)
    const { navigate } = useNavigation();
    const showDialog = () => setVisibledialogo(true);
    const hideDialog = () => setVisibledialogo(false);
    const [codigoeliminar,setCodigoelimnar]=useState('')
    const [conceptoeliminar,setConceptoelimnar]=useState('')
    const [datositem, setDatositem]=useState([])

    const eliminar=()=>{
        // Realiza una animación de rotación cuando se presiona el botón
        const valdel=[item.id]
        
        setCodigoelimnar(valdel)
        setConceptoelimnar(item.NombreGasto)
        showDialog(true)
        
    }
    const confimareliminacion = async()=>{
        setGuardando(true)
        
        const datoseliminar = {
          gastos:codigoeliminar,};
    
    
        const endpoint='EliminarEgreso/'
        const result = await Generarpeticion(endpoint, 'POST', datoseliminar);
          
        const respuesta=result['resp']
        if (respuesta === 200) {
            setGuardando(false)
            setActualizargastos(!actualizargastos)
            setActualizarresumen(true)
            setActualizarsaldos(true)
            setUpdstastsaldo(true)
        
            navigation.goBack();
            hideDialog()
          //setRecargadatos(!recargadatos)
            
        } else if(respuesta === 403 || respuesta === 401){
            setGuardando(false)
            await Handelstorage('borrar')
            setActivarsesion(false)
    
      }
  
      }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setGuardando(true)
            setDatositem(item)
        
            setCodigoelimnar(item.id)
            setConceptoelimnar(item.NombreGasto)
            navigation.setOptions({
            headerRight: () => (
                <View style={{flexDirection: 'row',alignItems: 'center'}}>
                    <TouchableOpacity style={{ marginRight: 20 }} onPress={ eliminar}>
                        <AntDesign name="delete" size={30} color="rgb(205,92,92)" />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => {navigate("GastosRegistro", { item});}}>
                        <AntDesign name="edit" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            ),
                });
            if(item.recarga==='si'){
                

                
                const cargardatos=async()=>{
                    const idact=item.id
                    const datestorage=await Handelstorage('obtenerdate');
                    const mes_storage=datestorage['datames']
                    const anno_storage=datestorage['dataanno']
                    const body = {};
                    const endpoint='MovileDatoEgreso/' + anno_storage +'/' + mes_storage + '/'+ idact + '/'
                    const result = await Generarpeticion(endpoint, 'POST', body);
                    const respuesta=result['resp']
                    if (respuesta === 200){
                        const registros=result['data']
                        registros.recarga='no'


                        Object.keys(registros).forEach(key => {
                            item[key] = registros[key];
                        });
                        setDatositem(registros)
                        
                        
                    }else if(respuesta === 403 || respuesta === 401){
                        
                        
                        await Handelstorage('borrar')
                        await new Promise(resolve => setTimeout(resolve, 1000))
                        setActivarsesion(false)
                    }
                    
                
        
                
                }
                cargardatos()
            }
            setGuardando(false)
            })
        return unsubscribe;
        
      }, [navigation]);
    return(
            <PaperProvider >
                {guardando &&(<Procesando></Procesando>)}
                <View  style={{ flex: 1 }}>
                    
                    <Portal>

                        <Dialog visible={visibledialogo} onDismiss={hideDialog}>
                            <Dialog.Title>Eliminar Registro</Dialog.Title>
                            <Dialog.Content>
                                <Text variant="bodyMedium">{`¿Desea eliminar el registro de ${conceptoeliminar} con ID operacion N°: ${codigoeliminar}?`}</Text>
                                
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideDialog}>Cancelar</Button>
                                <Button onPress={confimareliminacion}>ELIMINAR</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>




                    <View style={{flex: 1,marginTop:50,width:'90%',marginLeft:20,}}>

                        <View style={{flexDirection: 'row', alignItems: 'center',height:50,paddingLeft:20,paddingRight:20,justifyContent:'space-between',
                        borderTopWidth:2,borderTopColor:'white'}}>

                            <Text style={[{ color: colors.text}]}>
                                <Text style={[{ color: colors.text}]}>ID Operacion:</Text>{' '}
                                {datositem.id}
                            </Text>
                            <Text style={[{ color: colors.text}]}>
                                <Text style={[{ color: colors.text}]}>Periodo:</Text>{' '}
                                {datositem.NombreMesEgreso} / {item.AnnoEgreso}
                            </Text>
                        </View>


                        <Divider />

                        <View style={{alignItems:'center',justifyContent:'space-between',marginTop:30}}>

                            <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                                
                                {datositem.TipoGasto} / {datositem.CategoriaGasto}
                            </Text>
                            
                            <Divider />
    
                            <Text style={[styles.contenedortexto,{ color: colors.text,fontSize:25,fontWeight:'bold'}]}>
                                
                                Gs. {Number(datositem.monto_gasto).toLocaleString('es-ES')}
                            </Text>
                            <Divider />
                            <Divider />
                            <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                                
                                {datositem.NombreGasto}
                            </Text>
                            <Divider />
                            <Divider />
                           

                            <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                                
                                {moment(datositem.fecha_gasto).format('DD/MM/YYYY')}
                            </Text>
                        </View>

                        
                        <Divider />

                        {item.anotacion ? (

                            <View style={{borderWidth:1,borderColor:'white',height:50,padding:10,marginTop:20,marginLeft:5,marginRight:5,borderRadius:20}} > 

                                <Text style={[{ color: colors.text}]}>
                                    <Text style={[{ color: colors.text}]}>Obs.:  </Text>{' '}
                                    {datositem.anotacion}
                                </Text>
                            </View>
                            ) : null}

                        <View style={{alignItems:'center',justifyContent:'space-between',
                                    marginBottom:20,marginTop:20,borderBottomWidth:2,paddingBottom:7,borderBottomColor:'white'}}>
                            
                            <Text style={[{ color: colors.text}]}>
                                <Text style={[{ color: colors.text}]}>Creado:</Text>{' '}
                                {moment(datositem.fecha_registro).format('DD/MM/YYYY HH:mm:ss')}
                            </Text>
                        </View>
                    </View>


                    

                </View>
            </PaperProvider>
            
    )
}
const styles = StyleSheet.create({
    
    
    contenedortexto:{
        paddingBottom:30,
        fontSize:20
    }

  });
export default GastosDetalle