
import React,{useState,useEffect,useContext} from "react";
import "react-native-gesture-handler";
import Navigation from "./Navigation";
import { ActivityIndicator, View,SafeAreaView,StyleSheet } from "react-native";
import Login from "./screens/Login";
import Resumen from "./componentes/Resumen/Resumen";
import { AuthProvider } from "./AuthContext";
import Navigationv2 from "./Nivagationsv2";
import AppContent from "./AppContent";


export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

