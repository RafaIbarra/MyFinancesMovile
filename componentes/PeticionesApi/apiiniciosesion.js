
import {EXPO_PUBLIC_API_URL} from '@env';
// console.log('inicio sesion')
// console.log(EXPO_PUBLIC_API_URL)
async function Iniciarsesion(usuario,password){
    // console.log(EXPO_PUBLIC_API_URL)
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
    
    const response = await fetch(`${EXPO_PUBLIC_API_URL}/${endpoint}`, requestOptions);  
        data= await response.json();
        resp= response.status;
        
        datos={data,resp}
        return datos

} 
export default Iniciarsesion