import React,{useEffect} from "react";
import {  StyleSheet,View,ActivityIndicator,TouchableWithoutFeedback,Modal } from "react-native";
function Procesando (){
    // useEffect(()=>{
    //   
    // })
    return(
        <Modal
        transparent={true}
        animationType="none"
        visible={true}
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
      </Modal>
    )

}
const styles = StyleSheet.create({
    
      modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
     
})
export default Procesando