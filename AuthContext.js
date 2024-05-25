import React, { createContext, useState, useContext } from 'react';

// Creamos el contexto
export const AuthContext = createContext();

// Creamos el proveedor que contendrá el estado y la función para actualizarlo
export const AuthProvider = ({ children }) => {
  const [activarsesion, setActivarsesion] = useState(false);
  const [periodo, setPeriodo] = useState(false);
  const [sesiondata, setSesiondata] = useState();

  

  

  const [updstastsaldo, setUpdstastsaldo] = useState(true);
  const [imgestadisticasaldo,setImgestadisticasaldo]=useState([])

  const [updstastegreso, setUpdstastegreso] = useState(true);
  const [imgestadisticaegreso,setImgestadisticaegreso]=useState([])

  const [updstastingreso, setUpdstastingreso] = useState(true);
  const [imgestadisticaingreso,setImgestadisticaingreso]=useState([])

  const [estadocomponente,setEstadocomponente]=useState({
    compgastos:true,
    datagastos:[],

    compingresos:true,
    dataingresos:[],

    compresumen:true,
    dataresumen:[],

    compsaldos:true,
    datasaldos:[],

    categoriagasto:true,
    conceptosingresos:true,
    conceptosgastos:true,

  })

  const actualizarEstadocomponente = (campo, valor) => {
    setEstadocomponente(prevState => ({
      ...prevState,
      [campo]: valor,
    }));
  };


  return (
    <AuthContext.Provider value={{ activarsesion, setActivarsesion,
                                  periodo,setPeriodo,
                                  sesiondata,setSesiondata,

                                  
                                  
                                  updstastsaldo,setUpdstastsaldo,
                                  imgestadisticasaldo,setImgestadisticasaldo,
                                  updstastegreso, setUpdstastegreso,
                                  imgestadisticaegreso,setImgestadisticaegreso,
                                  updstastingreso, setUpdstastingreso,
                                  imgestadisticaingreso,setImgestadisticaingreso,
                                  
                                  estadocomponente,actualizarEstadocomponente

        }}>
      {children}
    </AuthContext.Provider>
  );
};