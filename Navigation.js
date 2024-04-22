import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { Image, Pressable, useColorScheme,StyleSheet  } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View,Text,TouchableOpacity } from "react-native";
import Home from "./screens/Home";
import DetalleIngreso from "./screens/DetalleIngreso";
import Resumen from "./componentes/Resumen/Resumen";

import Gastos from "./componentes/Gastos/Gastos";
import { useNavigation } from "@react-navigation/native";

import Ingresos from "./componentes/Ingresos/Ingresos";
import IngresosAgregar from "./componentes/Ingresos/IngresosAgregar";
import IngresosDetalle from "./componentes/Ingresos/IngresosDetalle";
import ConceptosGastos from "./componentes/ConceptosGastos/ConceptosGastos";
import Saldos from "./componentes/Saldos/Saldos";
import Estadisticas from "./componentes/Estadisticas/Estadisticas";


//////////////iconos///////////////////////////////
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';


const Drawer = createDrawerNavigator();
function DrawerGroup() {
    return (
      <Drawer.Navigator 
      
      
      // screenOptions={{headerTitle:'HOLa'}}
      screenOptions={{
        headerTitle: ({}) => (
          <View >
            <Text >UserName </Text>
          </View>
        ),
        headerTitleAlign:'center'
      }}
      >
        {/* <Drawer.Screen name="TabsGroup" component={TabsGroup} /> */}
        <Drawer.Screen name="Home" 
        component={HomeStackGroup} 
        
        />
        <Drawer.Screen name="ConceptosGastos" component={ConceptosGastos} />
        
      </Drawer.Navigator>
    );
  }
function TabsGroup({ navigation }) {
    return (
      <Tab.Navigator
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
        <Tab.Screen
          name="Home2" component={Resumen}
         
          
          
        />
        <Tab.Screen name="Notifications" component={Ingresos} />
        <Tab.Screen name="Settings" component={Gastos} />
      </Tab.Navigator>
    );
  }

  function TabsGroupv2({ navigation }) {
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
            tabBarLabel: ''
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
          tabBarLabel: ''
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
          tabBarLabel: ''
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
            tabBarLabel: ''
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
            tabBarLabel: ''
          }}
        />


      </Tab.Navigator>
    );
  }
const Tab = createBottomTabNavigator();




const HomeStack = createNativeStackNavigator();

function HomeStackGroup(){
  return(

    <HomeStack.Navigator screenOptions={{ headerShown: false }}
    
    >
    <HomeStack.Screen name="Resumen" component={TabsGroupv2}/>
    <HomeStack.Screen name="ResumenDatos" component={Resumen}/>
    {/* <HomeStack.Screen name="IngresosGroup" component={TabsIngresosGroup} /> */}
    <HomeStack.Screen name="IngresosGroup" component={Ingresos} />
    <HomeStack.Screen name="Gastos" component={Gastos} />
    
  </HomeStack.Navigator>
  )
}

function OpcionesHome({ navigation }) {
  return (
    
      <View  style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          
          <TouchableOpacity onPress={() => navigation.navigate('ResumenDatos')}>
           <Text>Resumen del mes </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('IngresosGroup')}>
           <Text>Ingresos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Gastos')}>
           <Text>Gastos</Text>
          </TouchableOpacity>
      </View>
  
  );
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

function Navigation(){
return(
    <NavigationContainer>
        {/* <StatusBar style="auto"></StatusBar> */}
        <DrawerGroup />
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
});

export default Navigation