import React, { createContext, useState, useContext } from 'react';

// Creamos el contexto
export const AuthContext = createContext();

// Creamos el proveedor que contendrá el estado y la función para actualizarlo
export const AuthProvider = ({ children }) => {
  const [activarsesion, setActivarsesion] = useState(false);

  return (
    <AuthContext.Provider value={{ activarsesion, setActivarsesion }}>
      {children}
    </AuthContext.Provider>
  );
};