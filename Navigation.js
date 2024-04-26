import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StyleSheet,Button  } from "react-native";
import { View,Text,TouchableOpacity } from "react-native";

//Componentes///////////////
import Resumen from "./componentes/Resumen/Resumen";
import Gastos from "./componentes/Gastos/Gastos";
import GastosDetalle from "./componentes/GastosDetalle/GastosDetalle";
import Ingresos from "./componentes/Ingresos/Ingresos";
import IngresosAgregar from "./componentes/Ingresos/IngresosAgregar";
import IngresosDetalle from "./componentes/Ingresos/IngresosDetalle";
import ConceptosGastos from "./componentes/ConceptosGastos/ConceptosGastos";
import Saldos from "./componentes/Saldos/Saldos";
import Estadisticas from "./componentes/Estadisticas/Estadisticas";
import DrawerContent from "./componentes/DrawerContent/DrawerContent";

////////////Storage
import Handelstorage from "./Storage/handelstorage";

//////////////iconos///////////////////////////////
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';


const Drawer = createDrawerNavigator();

// const DrawerContent = ({setActivarsesion,navigation }) => {
//     const navigateToHome = () => {
//       navigation.navigate('Home');
//     };

//     const navigateToConceptosGastos = () => {
//       navigation.navigate('ConceptosGastos');
//     };
//     const cerrar=async ()=>{
//       await Handelstorage('borrar')
//       await new Promise(resolve => setTimeout(resolve, 1000))
      
//       setActivarsesion(false)
//     }
//     return (
//       <View  style={styles.drawerContent}>
//         <Button title="Home" onPress={navigateToHome} />
//         <Button title="Conceptos Gastos" onPress={navigateToConceptosGastos} />
//         <Button title="Cerrar Sesion" onPress={cerrar} />
//       </View>
//     );
// };
function DrawerGroup({setActivarsesion,sesionname}) {
    return (
      <Drawer.Navigator 
      drawerContent={(props) => <DrawerContent {...props} setActivarsesion={setActivarsesion} />}
      screenOptions={{
        headerTitle: ({}) => (
          <View>
            <Text>{sesionname}</Text>
          </View>
        ),
        headerTitleAlign: 'center'
      }}
    >
      <Drawer.Screen name="Home" component={HomeStackGroup} />
      <Drawer.Screen name="ConceptosGastos" component={ConceptosGastos} />
      {/* <Drawer.Screen name="GastosDetalle" component={GastosDetalle} /> */}

    </Drawer.Navigator>
    );
  }



  function TabsGroup({ navigation }) {
    return (
      <Tab.Navigator 
      screenOptions={{ headerShown: false }} 
      >
        <Tab.Screen name="Home2" 
          component={Resumen}
          options={{
            tabBarIcon: ({focused, color, size }) => {
              let icocolor;
              icocolor = focused ? "black" : "blue";
              return  ( 
                <View style={styles.iconContainer}>
                  <Ionicons name="newspaper-outline" size={27} color={icocolor} />
                </View>
                  )
            },
            tabBarLabel: '',
            unmountOnBlur: true
          }}
          
        />
        <Tab.Screen name="Ingresos"
         component={Ingresos} 
         options={{
          tabBarIcon: ({focused, color, size }) => {
            let icocolor;
            icocolor = focused ? "black" : "blue";
            return  ( 
                      <View style={styles.iconContainer}>
                        <FontAwesome6 name="money-bill-trend-up" size={27} color={icocolor}  />
                      </View>
                    )
          },
          tabBarLabel: '',
          unmountOnBlur: true
        }}

         />
        <Tab.Screen name="Gastos"
         component={Gastos} 
         options={{
          tabBarIcon: ({focused, color, size }) => {
            let icocolor;
            icocolor = focused ? "black" : "blue";
            return  ( 
                    <View style={styles.iconContainer}>
                        <FontAwesome6 name="money-bill-transfer" size={27} color={icocolor}  />
                    </View>
                    )
          },
          tabBarLabel: '',
          unmountOnBlur: true
        }}
         />

        <Tab.Screen name="Saldos"
          component={Saldos} 
          options={{
            tabBarIcon: ({focused, color, size }) => {
              let icocolor;
              icocolor = focused ? "black" : "blue";
              return  ( 
                      <View style={styles.iconContainer}>
                        <FontAwesome6 name="sack-dollar" size={24} color={icocolor} />
                    </View>
                    )
            },
            tabBarLabel: '',
            unmountOnBlur: true
          }}
         />

       <Tab.Screen name="Estadisticas"
          component={Estadisticas} 
          options={{
            tabBarIcon: ({focused, color, size }) => {
              let icocolor;
              icocolor = focused ? "black" : "blue";
              return  ( 
                      <View style={styles.iconContainer}>
                        <Feather name="pie-chart" size={24} color={icocolor} />
                      </View>
                    )
            },
            tabBarLabel: '',
            unmountOnBlur: true
          }}
        />


      </Tab.Navigator>
    );
  }
const Tab = createBottomTabNavigator();




const HomeStack = createNativeStackNavigator();

function HomeStackGroup(){
  return(

    <HomeStack.Navigator >
    <HomeStack.Screen name="Resumen" component={TabsGroup} options={{ headerShown: false }}/>
    <HomeStack.Screen name="ResumenDatos" component={Resumen}/>
    <HomeStack.Screen name="IngresosGroup" component={Ingresos} />
    <HomeStack.Screen name="Gastos" component={Gastos} />
    <HomeStack.Screen name="GastosDetalle" 
      component={GastosDetalle} 
      options={{headerTitle:'Detalle del Gasto',
      headerTitleAlign:'center'
    }}
      />
    
  </HomeStack.Navigator>
  )
}



const TabIngresos = createBottomTabNavigator();
function TabsIngresosGroup({ navigation }) {
  return (
    <TabIngresos.Navigator
      screenOptions={({ route }) => ({
         headerTitleAlign: "center",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home2") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings";
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications-outline" : "notifications-outline";
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1DA1F2",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <TabIngresos.Screen
        name="Ingresos" component={Ingresos}
        
        
      />
      <TabIngresos.Screen name="Notifications" component={IngresosAgregar} />
      <TabIngresos.Screen name="Settings" component={IngresosDetalle} />
    </TabIngresos.Navigator>
  )
}

function Navigation( {setActivarsesion,sesionname}){
return(
    <NavigationContainer>
        {/* <StatusBar style="auto"></StatusBar> */}
        <DrawerGroup setActivarsesion={setActivarsesion} sesionname={sesionname} />
    </NavigationContainer>
)
}

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingTop:7
  },
  drawerContent: {
    flex: 1, // Esto asegura que DrawerContent ocupe solo el espacio necesario
    paddingTop: 20, // Espacio en la parte superior para evitar solapamiento con el header del drawer
    
    height:10
  },
});

export default Navigation