import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import { Modal, Portal, Text, Button, PaperProvider } from 'react-native-paper';
function IngresosAgregar (){
    const [visible, setVisible] = React.useState(true);
    const containerStyle = {backgroundColor: 'white', padding: 20};
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    return(
        // <View  style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        //     <Text> Agregar Ingresos del mes </Text>
        // </View>
        <PaperProvider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text>Example Modal.  Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
      <Button style={{marginTop: 30}} onPress={showModal}>
        Show
      </Button>
    </PaperProvider>
    )
}

export default IngresosAgregar