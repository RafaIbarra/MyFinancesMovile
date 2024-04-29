import React,{useState } from "react";
import {NavigationContainer,DefaultTheme} from "@react-navigation/native";

import { useTheme } from '@react-navigation/native';
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
import CloseSesion from "./componentes/Closesesion/closesesion";
import GastosRegistro from "./componentes/Gastos/GastosRegistro";

////////////Storage
import Handelstorage from "./Storage/handelstorage";

//////////////iconos///////////////////////////////
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MyTheme = {
  ...DefaultTheme,
    dark: true,
    colors: {
      ...DefaultTheme.colors,
      background: 'rgba(28,44,52,0.7)',
      text:'white',
      color:'red',
      primary:'white',
      tintcolor:'red',
      card: 'rgb(28,44,52)', //color de la barra de navegadores
      commentText:'red',
      bordercolor:'#d6d7b3',
      // iconcolor:'#cddae8cb'
      iconcolor:'white'
    },
};


const Drawer = createDrawerNavigator();


function DrawerGroup({sesionname}) {
  const { colors } = useTheme();
  
    return (
      <Drawer.Navigator 
      drawerContent={(props) => <DrawerContent {...props}/>}
      screenOptions={{
        headerTitle: ({}) => (
          <View >
            <Text style={{ color: colors.text,fontSize:20}}>{sesionname}</Text>
            
          </View>
        ),
        headerRight:({})=>(
          <View style={{marginRight:20}}>

            <TouchableOpacity  >
                      <AntDesign name="setting" size={27} color={colors.iconcolor} />
                      
                  </TouchableOpacity>
          </View>
        ),
        headerTitleAlign: 'center',
        
        headerTintColor: colors.text
         
      }}
      
    >
      <Drawer.Screen name="Home" component={HomeStackGroup} />
      <Drawer.Screen name="ConceptosGastos" component={ConceptosGastos} />
      <Drawer.Screen name="CloseSesion" component={CloseSesion}/>
      

    </Drawer.Navigator>
    );
  }



  function TabsGroup({ navigation }) {
    const { colors } = useTheme();
    return (
      <Tab.Navigator 
      screenOptions={{ headerShown: false }} 
      >
        <Tab.Screen name="Home2" 
          component={Resumen}
          options={{
            tabBarIcon: ({focused, color, size }) => {
              let nombrreico
              nombrreico = focused ? "book" : "book-outline";
              
              return  ( 
                    <View style={[styles.iconContainer, focused && styles.focusedIconContainer]}>
                          <Ionicons name={nombrreico} size={27} color={colors.iconcolor}  />
                      </View>
                      )
            },
            tabBarLabel: ({focused})=>{
              let titulolabel
              titulolabel = focused ? "Resumen" : "";
              return <Text style={{ color: colors.text,fontSize:10}}>{titulolabel}</Text>
            },
            headerTitle:'Resumen',
            unmountOnBlur: true
          }}
          
        />
        <Tab.Screen name="Ingresos"
         component={Ingresos} 
         options={{
          tabBarIcon: ({focused, color, size }) => {
            let nombrreico
            nombrreico = focused ? "briefcase-upload" : "briefcase-upload-outline";
            return  ( 
                     <View style={[styles.iconContainer, focused && styles.focusedIconContainer]}>
                        <MaterialCommunityIcons name={nombrreico} size={27} color={colors.iconcolor}   />
                      </View>
                    )
          },
          tabBarLabel: ({focused})=>{
            let titulolabel
            titulolabel = focused ? "Ingresos" : "";
            return <Text style={{ color: colors.text,fontSize:10}}>{titulolabel}</Text>
          },
          unmountOnBlur: true
        }}

         />
        <Tab.Screen name="Gastos"
         component={Gastos} 
         options={{
          tabBarIcon: ({focused, color, size }) => {
            let nombrreico
            nombrreico = focused ? "briefcase-download" : "briefcase-download-outline";
            
            return  ( 
                  <View style={[styles.iconContainer, focused && styles.focusedIconContainer]}>
                        <MaterialCommunityIcons name={nombrreico} size={27} color={colors.iconcolor}  />
                    </View>
                    )
          },
          tabBarLabel: ({focused})=>{
            let titulolabel
            titulolabel = focused ? "Gastos" : "";
            return <Text style={{ color: colors.text,fontSize:10}}>{titulolabel}</Text>
          },
          unmountOnBlur: true
        }}
         />

        <Tab.Screen name="Saldos"
          component={Saldos} 
          options={{
            tabBarIcon: ({focused, color, size }) => {
              let nombrreico
              nombrreico = focused ? "wallet" : "wallet-outline";
              
              return  ( 
                    <View style={[styles.iconContainer, focused && styles.focusedIconContainer]}>
                          <Ionicons name={nombrreico} size={27} color={colors.iconcolor}  />
                      </View>
                      )
            },
            tabBarLabel: ({focused})=>{
              let titulolabel
              titulolabel = focused ? "Saldos" : "";
              return <Text style={{ color: colors.text,fontSize:10}}>{titulolabel}</Text>
            },
            unmountOnBlur: true
          }}
         />

       <Tab.Screen name="Estadisticas"
          component={Estadisticas} 
          options={{
            tabBarIcon: ({focused, color, size }) => {
              let nombrreico
              nombrreico = focused ? "pie-chart-sharp" : "pie-chart-outline";
              
              return  ( 
                    <View style={[styles.iconContainer, focused && styles.focusedIconContainer]}>
                          <Ionicons name={nombrreico} size={27} color={colors.iconcolor}  />
                      </View>
                      )
            },
            tabBarLabel: ({focused})=>{
              let titulolabel
              titulolabel = focused ? "Estadisticas" : "";
              return <Text style={{ color: colors.text,fontSize:10}}>{titulolabel}</Text>
            },
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
      headerTitleAlign:'left',
      // headerRight: () => <Button title="Update count" name='count' />,
      headerRight: () => (
        <View style={{flexDirection: 'row',alignItems: 'center'}}>
          <TouchableOpacity style={{ marginRight: 20 }}>
              <AntDesign name="delete" size={30} color="rgb(205,92,92)" />
          </TouchableOpacity>




          <TouchableOpacity style={{ marginRight: 10 }} >
            <AntDesign name="edit" size={30} color="white" />
          </TouchableOpacity>
        </View>
      ),

    }}
    
      />
    <HomeStack.Screen name="GastosRegistro" component={GastosRegistro} />
    
    
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

function Navigation( {sesionname}){
return(
    <NavigationContainer theme={MyTheme }>
        {/* <StatusBar style="auto"></StatusBar> */}
        <DrawerGroup  sesionname={sesionname} />
    </NavigationContainer>
)
}

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    width:50,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginTop:5
    // backgroundColor:'blue',
    // borderWidth:1,
    // bordercolor:'red'
  },
  focusedIconContainer:{
    flex: 1,
    width:50,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginTop:5,
    backgroundColor:'rgba(78,78,78,0.2)',
    borderWidth:1,
    bordercolor:'rgba(78,78,78,0.2)',
    borderRadius:10
  },
  drawerContent: {
    flex: 1, // Esto asegura que DrawerContent ocupe solo el espacio necesario
    paddingTop: 20, // Espacio en la parte superior para evitar solapamiento con el header del drawer
    
    height:10
  },
});

export default Navigation