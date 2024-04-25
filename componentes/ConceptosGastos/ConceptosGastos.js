import React,{useState,useEffect} from "react";
import { ActivityIndicator, View,Text,Button } from "react-native";
import { List } from 'react-native-paper';

import { AntDesign } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
//<AntDesign name="barschart" size={sizeicon} color="black" /> 
function ConceptosGastos (){
    const [expanded, setExpanded] = React.useState(true);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const handlePress = () => setExpanded(!expanded);
    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
    
      const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };
    
      const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        const fechaFormateada = new Date(date).toISOString().split('T')[0]
        console.warn("Fecha Formateada: ", fechaFormateada);
        hideDatePicker();
      };
    return(
        <View  style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text> Conceptos de Gastos </Text>

            
            <List.Section >
                <List.Accordion
                    title="Uncontrolled Accordion"
                    left={props => <Text {...props} > <AntDesign name="barschart" size={24} color="black" /> Estadisticas </Text>}
                    expanded={expanded}
                    onPress={handlePress}>
                    
                    <List.Item title="First item" onPress={handlePress}/>
                    <List.Item title="Second item" onPress={handlePress} />
                </List.Accordion>
    
            </List.Section>

            <RNPickerSelect
      onValueChange={(value) => console.log(value)}
      items={[
        { label: 'Football', value: 'football' },
        { label: 'Baseball', value: 'baseball' },
        { label: 'Hockey', value: 'hockey' },
      ]}
    />

    <Button title="Show Date Picker" onPress={showDatePicker} />
        <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
        />
    

        </View>
    )
}

export default ConceptosGastos