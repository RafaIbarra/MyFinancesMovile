
import React,{useEffect} from "react";
import "react-native-gesture-handler";

import { AuthProvider } from "./AuthContext";

import AppContent from "./AppContent";


export default function App() {
  
  // useEffect(() => {
  //   setNavigationBarColor('red', 'light')
    
  // }, []);
  
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

