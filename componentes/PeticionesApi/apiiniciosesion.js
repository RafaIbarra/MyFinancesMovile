import APIBASE from "./baseurls";
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
    console.log(JSON.stringify({
        username: usuario.toLowerCase(),
        password: password,
      }))
    const response = await fetch(`${APIBASE}/${endpoint}`, requestOptions);  
        data= await response.json();
        resp= response.status;
        
        datos={data,resp}
        return datos

    // try {
    //     const response = await fetch(`${APIBASE}/${endpoint}`, requestOptions);
    //     if (!response.ok) {
    //       throw new Error('La solicitud no fue exitosa');
    //     }
    //     const data = await response.json();
    //     console.log('Datos recibidos:', data);
    //   } catch (error) {
    //     console.error('Error al realizar la solicitud:', error);
    //   }

} 
export default Iniciarsesion