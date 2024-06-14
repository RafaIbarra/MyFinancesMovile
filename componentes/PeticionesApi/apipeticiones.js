
import Handelstorage from "../../Storage/handelstorage";
import {EXPO_PUBLIC_API_URL} from '@env';
console.log(EXPO_PUBLIC_API_URL)

async function Generarpeticion(endpoint,metodo,bodyoptions){
    console.log(EXPO_PUBLIC_API_URL)
  let data={}
  let resp=0
  let datos={}
  let requestOptions = {};
  const datosstarage=await Handelstorage('obtener');
  const tokenstorage=datosstarage['token']
  const sesionstorage=datosstarage['sesion']
  
  bodyoptions.SESION=sesionstorage;
  
  if (metodo.toUpperCase()==='GET'){
      requestOptions = {
          method: metodo.toUpperCase(),
          headers: {
                      'Authorization':`Bearer ${tokenstorage}`,
                  }
          }

  } else{
      requestOptions = {
          method: metodo.toUpperCase(),
          headers: {  'Content-Type': 'application/json',
                      
                      'Authorization':`Bearer ${tokenstorage}`,
                  },
          body: JSON.stringify(bodyoptions)
          }
  }
  

  const response = await fetch(`${EXPO_PUBLIC_API_URL}/${endpoint}`, requestOptions);  
  
  data= await response.json();
  
  resp= response.status;
  
  datos={data,resp}
  return datos
}

export default Generarpeticion