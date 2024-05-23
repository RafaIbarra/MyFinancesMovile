import React, { createContext, useState, useContext } from 'react';

// Creamos el contexto
export const AuthContext = createContext();

// Creamos el proveedor que contendrá el estado y la función para actualizarlo
export const AuthProvider = ({ children }) => {
  const [activarsesion, setActivarsesion] = useState(false);
  const [periodo, setPeriodo] = useState(false);
  const [sesiondata, setSesiondata] = useState();
  const [actualizargastos, setActualizargastos] = useState(false);
  const [actualizaringresos, setActualizaringresos] = useState(false);


  const [actualizarresumen, setActualizarresumen] = useState(true);
  const [dataresumen,setDataresumen]=useState([])


  return (
    <AuthContext.Provider value={{ activarsesion, setActivarsesion,periodo,
                                  setPeriodo,sesiondata,setSesiondata,actualizargastos,setActualizargastos,
                                  actualizaringresos,setActualizaringresos,
                                  actualizarresumen,setActualizarresumen,
                                  dataresumen,setDataresumen
        }}>
      {children}
    </AuthContext.Provider>
  );
};