
import { APIBASE } from '@env';
async function Iniciarsesion(usuario,password){
    
    let data={}
    let resp=0
    let datos={}
    const endpoint='login/'
    const requestOptions = {
        method: 'POST',
        headers: {  'Content-Type': 'application/json',
                    
                },
        body: JSON.stringify({
                    username: usuario.toLowerCase(),
                    password: password,
                  }),
        }
    
    const response = await fetch(`${APIBASE}/${endpoint}`, requestOptions);  
        data= await response.json();
        resp= response.status;
        
        datos={data,resp}
        return datos

} 
export default Iniciarsesion