import React,{useState } from "react";
import {NavigationContainer,DefaultTheme} from "@react-navigation/native";

import { useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";


import { StyleSheet,Button  } from "react-native";
import { View,Text,TouchableOpacity } from "react-native";
import { List } from 'react-native-paper';

//Componentes///////////////
// import Resumen from "./componentes/Resumen/Resumen";
import ResumenPeriodo from "./componentes/ResumenPeriodo/ResumenPeriodo";
import Gastos from "./componentes/Gastos/Gastos";
import GastosDetalle from "./componentes/GastosDetalle/GastosDetalle";
import Ingresos from "./componentes/Ingresos/Ingresos";
import IngresoTransaccion from "./componentes/Ingresos/IngresoTransaccion";
import IngresosAgregar from "./componentes/Ingresos/IngresosAgregar";
// import IngresosDetalle from "./componentes/Ingresos/IngresosDetalle";
import IngresoDetalle from "./componentes/Ingresos/IngresoDetalle";

import Saldos from "./componentes/Saldos/Saldos";
import Estadisticas from "./componentes/Estadisticas/Estadisticas";
import DrawerContent from "./componentes/DrawerContent/DrawerContent";
import DrawerContentInicio from "./componentes/DrawerContentInicio/DrawerContentInicio";
import CloseSesion from "./componentes/Closesesion/closesesion";
import GastosTransaccion from "./componentes/Gastos/GastosTransaccion";
import EstadisticasMesEgreso from "./componentes/Estadisticas/EstadisticasMesEgreso";
import EstadisticasMesIngreso from "./componentes/Estadisticas/EstadisticasMesIngreso";

import MovimientosEgreso from "./componentes/MovimientosEgreso/MovimientosEgreso";
import MovimientosIngresos from "./componentes/MovimientosIngresos/MovimientosIngresos";

import ConceptosIngresos from "./componentes/ConceptosIngresos/ConceptosIngresos";
import ConceptosIngresosRegistro from "./componentes/ConceptosIngresos/ConceptosIngresosRegistro";
import ConceptoIngresoDetalle from "./componentes/ConceptosIngresos/ConceptoIngresoDetalle";

import ConceptosGastos from "./componentes/ConceptosGastos/ConceptosGastos";
import ConceptosGastosDetalle from "./componentes/ConceptosGastos/ConceptosGastosDetalle";
import ConceptosGastosRegistro from "./componentes/ConceptosGastos/ConceptosGastosRegistro";


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
      // background: 'rgba(28,44,52,0.7)',
      background: 'rgb(28,44,52)',
      backgroundInpunt: 'rgb(28,44,52)',
      textbordercoloractive:'rgb(44,148,228)',
      textbordercolorinactive:'gray',
      //background: 'red',
      text:'white',
      color:'red',
      primary:'white',
      tintcolor:'red',
      card: 'rgb(28,44,52)', //color de la barra de navegadores
      commentText:'red',
      bordercolor:'#d6d7b3',
      // iconcolor:'#cddae8cb'
      iconcolor:'white',
      
    },
};


const Drawer = createDrawerNavigator();

function DrawerInicio({sesionname}){
  const { colors } = useTheme();
  const sizeicon=25
  let colorborder='rgb(44,148,228)'

  return(

  <Drawer.Navigator
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
      headerStyle:{elevation:0},
      headerTintColor: colors.text,
      drawerLabelStyle: {marginLeft: -20},
      tabBarLabelStyle:{borderWidth:1,bordercolor:'red'},
      
    }}
    drawerContent={DrawerContentInicio}
  >
      <Drawer.Screen name="InicioHome" 
      component={HomeStackGroup}
      options={{
        drawerLabel: 'Inicio',
        title: 'Inicio',
        drawerIcon: ({size, color})=>(<AntDesign name="home" size={sizeicon} color={colors.iconcolor} />),
        drawerItemStyle:{borderBottomWidth:1,borderBottomColor:'white',marginBottom:5,marginTop:20}
        
        }}
      />
      <Drawer.Screen name="InicioConceptosIngreso" 
        component={IngresoStackGroup}
        options={{
          drawerLabel: 'Conceptos Ingresos',
          title: 'Conceptos Ingresos',
          drawerIcon: ({size, color})=>(
            <Feather name="trending-up"  size={sizeicon} color={colors.iconcolor} />
          ),
          drawerItemStyle:{borderBottomWidth:1,borderBottomColor:'white' }
         }}

       />
      <Drawer.Screen name="InicioCategoriaGastos" 
        component={HomeStackGroup}
        options={{
          drawerLabel: 'Categoria Gastos',
          title: 'Categoria Gastos',
          drawerIcon: ({size, color})=>(
            <Feather name="align-left"  size={sizeicon} color={colors.iconcolor} />
          ),
          drawerItemStyle:{borderBottomWidth:1,borderBottomColor:'white' }
         }}
       />
      <Drawer.Screen name="GastosStackGroup" 
        component={GastosStackGroup}
        options={{
          drawerLabel: 'Conceptos Gastos',
          title: 'Conceptos Gastos',
          drawerIcon: ({size, color})=>(
            <Feather name="trending-down" size={sizeicon} color={colors.iconcolor} />
          ),
          drawerItemStyle:{borderBottomWidth:1,borderBottomColor:'white' }
          }}

        />
      <Drawer.Screen name="InicioMovimientos" 
        component={OpcionesHistorialMovimientos}
        options={{
          drawerLabel: 'Movimientos',
          title: 'Movimientos',
          drawerIcon: ({size, color})=>(
            <Ionicons name="swap-horizontal-outline"  size={sizeicon} color={colors.iconcolor} />
          ),
          drawerItemStyle:{borderBottomWidth:1,borderBottomColor:'white' }
         }}
       />


      <Drawer.Screen name="InicioEstaditicas" 
        component={HomeStackGroup}
        options={{
          drawerLabel: 'Estadisticas',
          title: 'Estadisticas',
          drawerIcon: ({size, color})=>(
            <AntDesign name="barschart"  size={sizeicon} color={colors.iconcolor} />
          ),
          drawerItemStyle:{borderBottomWidth:1,borderBottomColor:'white' }
         }}
       />

      <Drawer.Screen name="InicioDatosPersonales" 
        component={HomeStackGroup}
        options={{
          drawerLabel: 'Datos Personales',
          title: 'Datos Personales',
          drawerIcon: ({size, color})=>(
            <Ionicons name="person-outline"  size={sizeicon} color={colors.iconcolor} />
          ),
          drawerItemStyle:{borderBottomWidth:1,borderBottomColor:'white' }
         }}
       />
  
  </Drawer.Navigator>
  )

}



const Tab = createBottomTabNavigator();
function TabsGroup({ navigation }) {
    const { colors } = useTheme();
    return (
      <Tab.Navigator 
      // screenOptions={{ headerShown: false }} 
      initialRouteName="Gastos"
      // screenOptions={{tabBarStyle:{height:60,elevation:50,borderTopWidth:1,borderTopColor:'black',marginBottom:2,marginTop:5}}}
      >
        <Tab.Screen name="Home2" 
          component={ResumenPeriodo}
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
            headerTitle:'Resumen del Mes',
            headerTitleStyle:{fontWeight:'bold',fontSize:20},
            headerTitleAlign:'center',
            unmountOnBlur: true,
            headerShown:true
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
          unmountOnBlur: true,
          headerShown:false
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
          unmountOnBlur: true,
          headerShown:false
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
            unmountOnBlur: true,
            headerShown:true,
            headerTitleAlign:'center',
            title:'Saldos del año',
            headerTitleStyle:{fontWeight:'bold',fontSize:20},

          }}
         />

       <Tab.Screen name="Estadisticas"
          component={OpcionesTabEstadisticas} 
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
            headerTitleAlign:'center',
            headerTitleStyle:{fontWeight:'bold',fontSize:20},
            // unmountOnBlur: true
          }}
        />


      </Tab.Navigator>
    );
  }

const HomeStack = createNativeStackNavigator();
function HomeStackGroup(){
  
  return(

    <HomeStack.Navigator >
        <HomeStack.Screen name="Resumen" component={TabsGroup} options={{ headerShown: false }}/>
        <HomeStack.Screen name="IngresoDetalle" 
          component={IngresoDetalle} 
          options={{headerTitle:'Detalle del Ingreso',
                    headerTitleAlign:'left',
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
        

        <HomeStack.Screen name="GastosDetalle" 
          component={GastosDetalle} 
          options={{headerTitle:'Detalle del Gasto',
                    headerTitleAlign:'left',
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
        <HomeStack.Screen name="GastosRegistro" 
                          component={GastosTransaccion} 
                          options={{headerTitle:'Registro Gastos',
                          headerTitleAlign:'center',
                          
                        }}
        />

        <HomeStack.Screen name="IngresoTransaccion" 
                            component={IngresoTransaccion} 
                            options={{headerTitle:'Registro Ingresos',
                            headerTitleAlign:'center',
                            
                          }}
        />

        
    
    
  </HomeStack.Navigator>
  )
}


const ConceptosIngresoStack=createNativeStackNavigator();
function IngresoStackGroup(){
  
  return(

    <ConceptosIngresoStack.Navigator
     
     >
        
        <ConceptosIngresoStack.Screen name="ConceptosIngresos" 
          component={ConceptosIngresos} 
          options={{headerShown:false}}
        />

      <ConceptosIngresoStack.Screen name="ConceptoIngresoDetalle" 
                component={ConceptoIngresoDetalle} 
                options={{headerTitle:'Detalle del Concepto',
                          headerTitleAlign:'left',
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
              

      
        <ConceptosIngresoStack.Screen name="ConceptosIngresosRegistro" 
                          component={ConceptosIngresosRegistro} 
                          options={{headerTitle:'Registro Concepto Ingreso',
                          headerTitleAlign:'center',
                          
                        }}
        />

        
    
    
  </ConceptosIngresoStack.Navigator>
  )
}

const ConceptosGastosStack=createNativeStackNavigator();
function GastosStackGroup(){
  
  return(

    <ConceptosGastosStack.Navigator
     
     >
        
        <ConceptosGastosStack.Screen name="ConceptosGastos" 
          component={ConceptosGastos} 
          options={{headerShown:false}}
        />

      <ConceptosGastosStack.Screen name="ConceptosGastosDetalle" 
                component={ConceptosGastosDetalle} 
                options={{headerTitle:'Detalle del Concepto',
                          headerTitleAlign:'left',
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
              

      
        <ConceptosGastosStack.Screen name="ConceptosGastosRegistro" 
                          component={ConceptosGastosRegistro} 
                          options={{headerTitle:'Registro Concepto Gasto',
                          headerTitleAlign:'center',
                          
                        }}
        />

        
    
    
  </ConceptosGastosStack.Navigator>
  )
}




const TabEstadisticas=createMaterialTopTabNavigator()
function OpcionesTabEstadisticas({navigation}){

  return(

  <TabEstadisticas.Navigator

  screenOptions={
    {
      "tabBarIndicatorStyle": {"backgroundColor": "rgb(44,148,228)"},
      tabBarLabelStyle: { fontSize: 16,textTransform:'none' },
       
      
    }
    

  }
  >

    <TabEstadisticas.Screen 
      name="EstadisticasSaldo" 
      component={Estadisticas}
      options={{
        title:'Saldos',
        unmountOnBlur:true ,
        
      }}
    >
    </TabEstadisticas.Screen>

    <TabEstadisticas.Screen name="EstadisticasIngreso" component={EstadisticasMesIngreso}
    options={{
       tabBarLabel: 'Ingresos',
       
      unmountOnBlur:true
    }}
    >

    </TabEstadisticas.Screen>

    <TabEstadisticas.Screen name="EstadisticasEgreso" component={EstadisticasMesEgreso}
    options={{
      title:'Gastos',
      unmountOnBlur:true
    }}
    >

    </TabEstadisticas.Screen>
  </TabEstadisticas.Navigator>
  )

}

///////// Navegaciones para historial de movimientos /////////////////////
const Tabhistorial=createMaterialTopTabNavigator()
function OpcionesHistorialMovimientos({navigation}){
  return(

    <Tabhistorial.Navigator
  
    screenOptions={
      {
        "tabBarIndicatorStyle": {"backgroundColor": "rgb(44,148,228)"},
        tabBarLabelStyle: { fontSize: 16,textTransform:'none' },
        
        
        
      }
      
  
    }
    >
  
      <Tabhistorial.Screen 
        name="HistoralGastos" 
        component={MovimientosEgreso}
        options={{
          title:'Movimimiento Gastos',
          unmountOnBlur:true ,
          
        }}
      >
      </Tabhistorial.Screen>
  
      <Tabhistorial.Screen 
      name="HistotialIngresos" 
      component={MovimientosIngresos}
      options={{
         tabBarLabel: 'Movimientos Ingresos',
         
        unmountOnBlur:true
      }}
      >
  
      </Tabhistorial.Screen>
  
      
    </Tabhistorial.Navigator>
    )

}

function Navigation( {sesionname}){
return(
    <NavigationContainer theme={MyTheme }>
        {/* <StatusBar style="auto"></StatusBar> */}
        <DrawerInicio  sesionname={sesionname} />
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
    // backgroundColor:'rgba(78,78,78,0.2)',
    backgroundColor:'rgba(44,148,228,0.5)',
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