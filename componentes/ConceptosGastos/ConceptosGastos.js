import * as React from "react";
import { ActivityIndicator, View,Text } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';

function ConceptosGastos (){
    return(
        <View  style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text> Conceptos de Gastos </Text>

            <DropDownPicker
                    items={[
                    { label: 'Opción 1', value: 'opcion1' },
                    { label: 'Opción 2', value: 'opcion2' },
                    { label: 'Opción 3', value: 'opcion3' },
                    ]}
                    defaultValue={'opcion1'}
                    containerStyle={{ height: 40, width: 150 }}
                    onChangeItem={(item) => console.log(item.value)}
                />
            
        </View>
    )
}

export default ConceptosGastos