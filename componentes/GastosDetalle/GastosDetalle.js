import React,{useState,useEffect} from "react";
import { useRoute } from "@react-navigation/native";
import { ActivityIndicator, View,Text,StyleSheet } from "react-native";
import moment from 'moment';
function GastosDetalle (){
    const {
        params: { item },
      } = useRoute();

    //   useEffect(() => {

    //     const cargardatos=()=>{
    //         console.log(item)

           
    //     }
    //     cargardatos()
    //   }, []);
    return(
        <View  style={{ flex: 1 }}>
            
            <View style={styles.container}>

                <Text style={styles.contenedortexto}>
                    <Text style={styles.labeltext}>Codigo Operacion:</Text>{' '}
                    {item.id}
                </Text>


                <Text style={styles.contenedortexto}>
                    <Text style={styles.labeltext}>Periodo:</Text>{' '}
                    {item.NombreMesEgreso} / {item.AnnoEgreso}
                </Text>

                <Text style={styles.contenedortexto}>
                    <Text style={styles.labeltext}>Tipo Gasto:</Text>{' '}
                    {item.TipoGasto}
                </Text>

                <Text style={styles.contenedortexto}>
                    <Text style={styles.labeltext}>Categoria:</Text>{' '}
                    {item.CategoriaGasto}
                </Text>


                <Text style={styles.contenedortexto}>
                    <Text style={styles.labeltext}>Descripcion:</Text>{' '}
                    {item.NombreGasto}
                </Text>

                <Text style={styles.contenedortexto}>
                    <Text style={styles.labeltext}>Monto Gasto:</Text>{' '}
                    {Number(item.monto_gasto).toLocaleString('es-ES')} Gs.
                </Text>

                <Text style={styles.contenedortexto}>
                    <Text style={styles.labeltext}>Fecha Gasto:</Text>{' '}
                    {moment(item.fecha_gasto).format('DD/MM/YYYY')}
                </Text>

                <Text style={styles.contenedortexto}>
                    <Text style={styles.labeltext}>Fecha Regisro:</Text>{' '}
                    {moment(item.fecha_registro).format('DD/MM/YYYY HH:mm:ss')}
                </Text>


                <Text style={styles.contenedortexto}>
                    <Text style={styles.labeltext}>Anotacion:</Text>{' '}
                    {item.anotacion}
                </Text>

            </View>
            

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '90%', 
        marginLeft:'5%',
        marginTop:'33%',
        borderRadius: 10, 
        borderWidth: 2, 
        borderColor: 'rgb(182, 212, 212)', 
        padding:10,
        justifyContent:'flex-start',
        
      },
    labeltext:{
        fontWeight:'bold',
    },
    contenedortexto:{
        paddingBottom:10
    }

  });
export default GastosDetalle