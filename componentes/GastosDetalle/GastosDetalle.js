import React,{useState,useEffect} from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, View,Text,StyleSheet,TouchableOpacity } from "react-native";
import { Modal, Portal,  PaperProvider,Dialog,Button,Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Generarpeticion from "../PeticionesApi/apipeticiones";
import moment from 'moment';
import { useTheme } from '@react-navigation/native';
function GastosDetalle ({ navigation }){
    const {params: { item },} = useRoute();
    const { colors } = useTheme();
    const [count, setCount] = useState(0);
    const [countdos, setCountdos] = useState(0);
    const [visibledialogo, setVisibledialogo] = useState(false)
    const { navigate } = useNavigation();
    const showDialog = () => setVisibledialogo(true);
    const hideDialog = () => setVisibledialogo(false);
    const [codigoeliminar,setCodigoelimnar]=useState('')
    const [conceptoeliminar,setConceptoelimnar]=useState('')

    const eliminar=()=>{
        // Realiza una animación de rotación cuando se presiona el botón
        const valdel=[item.id]
        
        setCodigoelimnar(valdel)
        setConceptoelimnar(item.NombreGasto)
        showDialog(true)
        
    }
    const confimareliminacion = async()=>{
      
        const datoseliminar = {
          gastos:codigoeliminar,};
    
    
        const endpoint='EliminarEgreso/'
        const result = await Generarpeticion(endpoint, 'POST', datoseliminar);
          
        const respuesta=result['resp']
        if (respuesta === 200) {
        
          navigation.goBack();
          hideDialog()
          //setRecargadatos(!recargadatos)
            
        } else if(respuesta === 403 || respuesta === 401){
          
          console.log(respuesta)
          await Handelstorage('borrar')
          setActivarsesion(false)
    
      }
  
      }

    useEffect(() => {
        
        
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
        

        
      }, [navigation]);
    return(
            <PaperProvider>
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
                    {/* <View style={styles.container}>

                    

                        <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                            <Text style={[styles.labeltext,{ color: colors.text}]}>Codigo Operacion:</Text>{' '}
                            {item.id}
                        </Text>


                        <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                            <Text style={[styles.labeltext,{ color: colors.text}]}>Periodo:</Text>{' '}
                            {item.NombreMesEgreso} / {item.AnnoEgreso}
                        </Text>

                        <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                            <Text style={[styles.labeltext,{ color: colors.text}]}>Tipo Gasto:</Text>{' '}
                            {item.TipoGasto}
                        </Text>

                        <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                            <Text style={[styles.labeltext,{ color: colors.text}]}>Categoria:</Text>{' '}
                            {item.CategoriaGasto}
                        </Text>


                        <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                            <Text style={[styles.labeltext,{ color: colors.text}]}>Descripcion:</Text>{' '}
                            {item.NombreGasto}
                        </Text>

                        <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                            <Text style={[styles.labeltext,{ color: colors.text}]}>Monto Gasto:</Text>{' '}
                            {Number(item.monto_gasto).toLocaleString('es-ES')} Gs.
                        </Text>

                        <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                            <Text style={[styles.labeltext,{ color: colors.text}]}>Fecha Gasto:</Text>{' '}
                            {moment(item.fecha_gasto).format('DD/MM/YYYY')}
                        </Text>

                        <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                            <Text style={[styles.labeltext,{ color: colors.text}]}>Fecha Regisro:</Text>{' '}
                            {moment(item.fecha_registro).format('DD/MM/YYYY HH:mm:ss')}
                        </Text>


                        <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                            <Text style={[styles.labeltext,{ color: colors.text}]}>Anotacion:</Text>{' '}
                            {item.anotacion}
                        </Text>

                    </View> */}



                    <View style={{flex: 1,borderWidth:1,borderRadius:50,borderStartColor:'white',
                                    borderBottomColor:'white',justifyContent: 'center',width:'90%',
                                    marginLeft:20,marginBottom:50,marginTop:50
                                }}>

                        <View style={{flexDirection: 'row', alignItems: 'center',height:50,paddingLeft:20,paddingRight:20,justifyContent:'space-between',
                        borderTopWidth:1,borderTopColor:'white'}}>

                            <Text style={[{ color: colors.text}]}>
                                <Text style={[{ color: colors.text}]}>ID Operacion:</Text>{' '}
                                {item.id}
                            </Text>
                            <Text style={[{ color: colors.text}]}>
                                <Text style={[{ color: colors.text}]}>Periodo:</Text>{' '}
                                {item.NombreMesEgreso} / {item.AnnoEgreso}
                            </Text>
                        </View>


                        <Divider />

                        <View style={{alignItems:'center',justifyContent:'space-between'}}>

                            <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                                
                                {item.TipoGasto} - {item.CategoriaGasto}
                            </Text>

    
                            <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                                
                                Gs. {Number(item.monto_gasto).toLocaleString('es-ES')}
                            </Text>

                            <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                                
                                {item.NombreGasto}
                            </Text>
                            
                            {/* <Text style={[styles.contenedortexto, { color: colors.text }]}>
                                    {item.anotacion}
                                </Text> */}

                            <Text style={[styles.contenedortexto,{ color: colors.text}]}>
                                
                                {moment(item.fecha_gasto).format('DD/MM/YYYY')}
                            </Text>
                        </View>

                        <Divider />
                        <Divider />

                        {item.anotacion ? (

                            <View style={{borderWidth:1,borderColor:'white',height:50,padding:10,marginTop:20,marginLeft:5,marginRight:5,borderRadius:20}} > 

                                <Text style={[{ color: colors.text}]}>
                                    <Text style={[{ color: colors.text}]}>Obs.:  </Text>{' '}
                                    {item.anotacion}
                                </Text>
                            </View>
                            ) : null}

                        <View style={{alignItems:'center',justifyContent:'space-between',marginTop:20,borderBottomWidth:1,borderBottomColor:'white'}}>
                            
                            <Text style={[{ color: colors.text}]}>
                                <Text style={[{ color: colors.text}]}>Creado:</Text>{' '}
                                {moment(item.fecha_registro).format('DD/MM/YYYY HH:mm:ss')}
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
export default GastosDetalle