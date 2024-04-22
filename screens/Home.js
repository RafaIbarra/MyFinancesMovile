import * as React from "react";
import { ActivityIndicator, View,Text } from "react-native";
import { TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import HomeResumen from '../componentes/HomeResumen/HomeResumen.js'
import Ingresos from "../componentes/Ingresos/Ingresos.js";

function Home (){
    const { navigate } = useNavigation();

    return(
        <View  style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            
            <TouchableOpacity>
             <Text>Resumen del mes</Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => {navigate("Ingresos",{Ingresos})}}>
             <Text>Ingresos</Text>
            </TouchableOpacity>
            <TouchableOpacity>
             <Text>Gastos</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Home