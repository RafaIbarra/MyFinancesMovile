import React, { createContext, useState, useContext } from 'react';

// Creamos el contexto
export const AuthContext = createContext();

// Creamos el proveedor que contendrá el estado y la función para actualizarlo
export const AuthProvider = ({ children }) => {
  const [activarsesion, setActivarsesion] = useState(false);
  const [periodo, setPeriodo] = useState(false);
  const [sesiondata, setSesiondata] = useState();

  

  const [versionsys,setVersionsys]=useState('Version 1.7')

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

    compmovimientos:true,
    datamovimientos:[],

    categoriagasto:true,
    conceptosingresos:true,
    conceptosgastos:true,

    mediospagoscomp:true,
    entidadesbeneficioscomp:true

  })

  const actualizarEstadocomponente = (campo, valor) => {
    setEstadocomponente(prevState => ({
      ...prevState,
      [campo]: valor,
    }));
  };

  const reiniciarvalores=()=>{
    setUpdstastsaldo(true)
    setUpdstastegreso(true)
    setUpdstastingreso(true)
    
    actualizarEstadocomponente('compgastos',true)
    actualizarEstadocomponente('compingresos',true)
    actualizarEstadocomponente('compresumen',true)
    actualizarEstadocomponente('compsaldos',true)

    actualizarEstadocomponente('categoriagasto',true)
    actualizarEstadocomponente('conceptosingresos',true)
    actualizarEstadocomponente('conceptosgastos',true)
    
    actualizarEstadocomponente('compmovimientos',true)
    actualizarEstadocomponente('mediospagoscomp',true)
    actualizarEstadocomponente('entidadesbeneficioscomp',true)

  }

  const reiniciarvalorestransaccion=()=>{
    setUpdstastsaldo(true)
    setUpdstastegreso(true)
    setUpdstastingreso(true)
    
    actualizarEstadocomponente('compgastos',true)
    actualizarEstadocomponente('compingresos',true)
    actualizarEstadocomponente('compresumen',true)
    actualizarEstadocomponente('compsaldos',true)
    
  }

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
                                  
                                  estadocomponente,actualizarEstadocomponente,
                                  versionsys,setVersionsys,
                                  reiniciarvalores,reiniciarvalorestransaccion

        }}>
      {children}
    </AuthContext.Provider>
  );
};