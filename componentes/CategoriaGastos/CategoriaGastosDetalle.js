import React,{useState,useEffect,useContext} from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {  View,Text,StyleSheet,TouchableOpacity } from "react-native";
import {  Portal,  PaperProvider,Dialog,Button,Divider } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import Procesando from "../Procesando/Procesando";
import moment from 'moment';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from "../../AuthContext";

function CategoriaGastosDetalle ({ navigation }){
    const {params: { concepto },} = useRoute();
    const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);
    const { colors } = useTheme();
    const [guardando,setGuardando]=useState(false)
    const [visibledialogo, setVisibledialogo] = useState(false)
    const { navigate } = useNavigation();
    const showDialog = () => setVisibledialogo(true);
    const hideDialog = () => setVisibledialogo(false);
    const [codigoeliminar,setCodigoelimnar]=useState('')
    const [conceptoeliminar,setConceptoelimnar]=useState('')
    const [valorconcepto,setValorConcepto]=useState(0)
    const [datositem, setDatositem]=useState([])

    const eliminar=()=>{
        // Realiza una animación de rotación cuando se presiona el botón
        const valdel=[concepto.id]
        
        setCodigoelimnar(valdel)
        setConceptoelimnar(concepto.nombre_categoria)
        showDialog(true)
        
    }
    const confimareliminacion = async()=>{
        setGuardando(true)
        const datoseliminar = {
            categorias:codigoeliminar,};
    
    
        const endpoint='EliminarCategorias/'
        const result = await Generarpeticion(endpoint, 'POST', datoseliminar);
          
        const respuesta=result['resp']
        if (respuesta === 200) {
            setGuardando(false)
            actualizarEstadocomponente('categoriagasto',!estadocomponente.categoriagasto)
            navigation.goBack();
            hideDialog()
          
            
        } else if(respuesta === 403 || respuesta === 401){
          
            setGuardando(false)
            await Handelstorage('borrar')
            setActivarsesion(false)
    
      }
  
      }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setGuardando(true)
            setDatositem(concepto)
            setValorConcepto(concepto.TotalIngresos)
        
            setCodigoelimnar(concepto.id)
            setConceptoelimnar(concepto.nombre_producto)
            navigation.setOptions({
            headerRight: () => (
                <View style={{flexDirection: 'row',alignItems: 'center'}}>
                    <TouchableOpacity style={{ marginRight: 20 }} onPress={ eliminar}>
                        <AntDesign name="delete" size={30} color="rgb(205,92,92)" />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => {navigate("CategoriaGastosRegistro", { concepto});}}>
                        <AntDesign name="edit" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            ),
                });
            if(concepto.recarga==='si'){
                

                
                const cargardatos=async()=>{
                    const idact=concepto.id
                
                    const body = {};
                    const endpoint='MisCategorias/' + idact +'/' 
                    const result = await Generarpeticion(endpoint, 'POST', body);
                    const respuesta=result['resp']
                    if (respuesta === 200){
                        const registros=result['data'][0]
                        registros.recarga='no'
                        


                        Object.keys(registros).forEach(key => {
                            concepto[key] = registros[key];
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
                                { valorconcepto >0 ? <Text variant="bodyMedium">{`¿Desea eliminar el registro de ${conceptoeliminar} con ID Concepto N°: ${codigoeliminar}?. Se liminaran TODOS los registros de ingresos asociados a él!!!`}</Text> : 
                                <Text variant="bodyMedium">{`¿Desea eliminar el registro de ${conceptoeliminar} con ID Categoria N°: ${codigoeliminar}?`}</Text>
                                }
                                
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideDialog}>Cancelar</Button>
                                <Button onPress={confimareliminacion}>ELIMINAR</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                  



                    <View style={{flex: 1,
                                    marginTop:50,
                                    width:'90%',
                                    marginLeft:20,
                                }}>

                        <View style={{ alignItems: 'center',height:50,paddingLeft:20,paddingRight:20,justifyContent:'center',
                        borderTopWidth:2,borderTopColor:'white',backgroundColor:colors.subtitulo}}>

                            <Text style={[{ color: colors.text}]}>
                                <Text style={[{ color: colors.text}]}>ID Categoria:</Text>{' '}
                                {datositem.id}
                            </Text>
                            
                        </View>


                        <Divider />

                        <View style={{alignItems:'center',justifyContent:'space-between',marginTop:30}}>

                        <Text style={[styles.contenedortexto,{ color: colors.text,fontSize:25,fontWeight:'bold'}]}>
                                
                                {datositem.nombre_categoria}
                            </Text>

                           
                            <Divider />
    
                           
                            <Divider />
                            <Divider />
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
export default CategoriaGastosDetalle