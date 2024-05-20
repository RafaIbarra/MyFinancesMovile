import React from "react";
import {  View, StyleSheet,Image    } from "react-native";

function ImagenEstadistica ({imgprops}){

   
    return(

    <View style={styles.container}>

                    <Image
                        source={{ uri: `data:image/png;base64,${imgprops}` }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>
    )


}

const styles = StyleSheet.create({
    container: {
      width: '100%', // Ancho deseado para el View
      height: '90%', // Altura deseada para el View
      justifyContent: 'center', // Alinea la imagen en el centro horizontalmente
      alignItems: 'center', // Alinea la imagen en el centro verticalmente
    },
    image: {
      flex: 1, // Hace que la imagen se ajuste al tamaño del View
      width: '110%', // Ancho de la imagen igual al 100% del View
      height: '150%', // Altura de la imagen igual al 100% del View
    },
  });
export default ImagenEstadistica