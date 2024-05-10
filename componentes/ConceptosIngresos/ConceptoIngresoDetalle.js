import React,{useState,useEffect} from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, View,Text,StyleSheet,TouchableOpacity } from "react-native";
import { Modal, Portal,  PaperProvider,Dialog,Button,Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import moment from 'moment';
import { useTheme } from '@react-navigation/native';

function ConceptoIngresoDetalle ({ navigation }){
    const {params: { concepto },} = useRoute();
    
    const { colors } = useTheme();
    const [count, setCount] = useState(0);
    const [countdos, setCountdos] = useState(0);
    const [visibledialogo, setVisibledialogo] = useState(false)
    const { navigate } = useNavigation();
    const showDialog = () => setVisibledialogo(true);
    const hideDialog = () => setVisibledialogo(false);
    const [codigoeliminar,setCodigoelimnar]=useState('')
    const [conceptoeliminar,setConceptoelimnar]=useState('')
    const [datositem, setDatositem]=useState([])

    const eliminar=()=>{
        // Realiza una animación de rotación cuando se presiona el botón
        const valdel=[concepto.id]
        
        setCodigoelimnar(valdel)
        setConceptoelimnar(concepto.nombre_producto)
        showDialog(true)
        
    }
    const confimareliminacion = async()=>{
      
        const datoseliminar = {
          productos:codigoeliminar,};
    
    
        const endpoint='EliminarProductos/'
        const result = await Generarpeticion(endpoint, 'POST', datoseliminar);
          
        const respuesta=result['resp']
        if (respuesta === 200) {
        
          navigation.goBack();
          hideDialog()
          //setRecargadatos(!recargadatos)
            
        } else if(respuesta === 403 || respuesta === 401){
          
          
          await Handelstorage('borrar')
          setActivarsesion(false)
    
      }
  
      }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
        setDatositem(concepto)
        console.log(concepto)
        setCodigoelimnar(concepto.id)
        setConceptoelimnar(concepto.nombre_producto)
        navigation.setOptions({
          headerRight: () => (
            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                <TouchableOpacity style={{ marginRight: 20 }} onPress={ eliminar}>
                    <AntDesign name="delete" size={30} color="rgb(205,92,92)" />
                </TouchableOpacity>

                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => {navigate("ConceptosIngresosRegistro", { concepto});}}>
                    <AntDesign name="edit" size={30} color="white" />
                </TouchableOpacity>
            </View>
          ),
            });
        if(concepto.recarga==='si'){
            

            
            const cargardatos=async()=>{
                const idact=concepto.id
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
        
        })
        return unsubscribe;
        
      }, [navigation]);
    return(
            <PaperProvider >
                <View  style={{ flex: 1 }}>
                    
                    <Portal>

                        <Dialog visible={visibledialogo} onDismiss={hideDialog}>
                            <Dialog.Title>Eliminar Registro</Dialog.Title>
                            <Dialog.Content>
                                <Text variant="bodyMedium">{`¿Desea eliminar el registro de ${conceptoeliminar} con ID Concepto N°: ${codigoeliminar}?`}</Text>
                                
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideDialog}>Cancelar</Button>
                                <Button onPress={confimareliminacion}>ELIMINAR</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                  



                    <View style={{flex: 1,
                                    // borderWidth:1,
                                    // borderRadius:50,
                                    // borderStartColor:'white',
                                    // borderBottomColor:'white',
                                    // justifyContent: 'center',
                                    marginTop:50,
                                    width:'90%',
                                    marginLeft:20,
                                    // marginBottom:50,marginTop:50
                                }}>

                        <View style={{ alignItems: 'center',height:50,paddingLeft:20,paddingRight:20,justifyContent:'center',
                        borderTopWidth:2,borderTopColor:'white'}}>

                            <Text style={[{ color: colors.text}]}>
                                <Text style={[{ color: colors.text}]}>ID Concepto:</Text>{' '}
                                {datositem.id}
                            </Text>
                            {/* <Text style={[{ color: colors.text}]}>
                                <Text style={[{ color: colors.text}]}>Periodo:</Text>{' '}
                                {datositem.NombreMesEgreso} / {item.AnnoEgreso}
                            </Text> */}
                        </View>


                        <Divider />

                        <View style={{alignItems:'center',justifyContent:'space-between',marginTop:30}}>

                        <Text style={[styles.contenedortexto,{ color: colors.text,fontSize:25,fontWeight:'bold'}]}>
                                
                                {datositem.nombre_producto}
                            </Text>

                           
                            <Divider />
    
                            <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                                
                                Gs. {Number(datositem.TotalIngresos).toLocaleString('es-ES')}
                            </Text>
                            <Divider />
                            <Divider />
                            <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                                
                                {datositem.DescripcionTipoProducto} 
                            </Text>
                            <Divider />
                            <Divider />
                            {/* <Text style={[styles.contenedortexto, { color: colors.text }]}>
                                    {item.anotacion}
                                </Text> */}

                            <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                                
                                {moment(datositem.fecha_gasto).format('DD/MM/YYYY')}
                            </Text>
                        </View>

                        
                        <Divider />

                        

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
    container: {
        width: '90%', 
        marginLeft:'5%',
        marginTop:'33%',
        // borderRadius: 10, 
        borderWidth: 2, 
        borderBottomColor: 'rgb(182, 212, 212)', 
        borderTopColor: 'rgb(182, 212, 212)', 
        padding:10,
        justifyContent:'flex-start',
        
      },
    labeltext:{
        fontWeight:'bold',
        fontSize:20
    },
    contenedortexto:{
        paddingBottom:30,
        fontSize:20
    }

  });
export default ConceptoIngresoDetalle