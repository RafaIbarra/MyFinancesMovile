import React,{useState,useEffect} from "react";
import { Modal, Portal,  PaperProvider,Text,Divider,TextInput } from 'react-native-paper';
import {  StyleSheet,Button,View } from "react-native";
import Handelstorage from "../../Storage/handelstorage";
import Generarpeticion from "../PeticionesApi/apipeticiones";
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";


function GastoModal({visible,setVisible}){
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [mesprincipal,setMesprincipal]=useState(0)
    const [annoprincipal,setAnnoprincipal]=useState(0)
    const [listacategorias,setListacategorias]=useState([])
    const [listagastos,setListagastos]=useState([])

    const [optionscategoria, setOptionscategoria] = useState([]);
    const [selectedOptioncategoria, setSelectedOptioncategoria] = useState(null);

    const [optionsgasto, setOptionsgasto] = useState([]);
    const [selectedOptiongasto, setSelectedOptiongasto] = useState(null);

    const[categoriasel,setCategoriasel]=useState(0)
    const[gasttosel,setGastosel]=useState(0)
    const[monto,setMonto]=useState('')
    const[anotacion,setAnotacion]=useState('')
    const [fechaegreso, setFechaegreso] = useState(null);

    const containerStyle = {backgroundColor: 'white', padding: 20};
    const cerrar=()=>{
        setVisible(false)
    }
    const SeleccionCategoria = (value) => {
        setSelectedOptioncategoria(value);
        setCategoriasel(value)
        const lista_gastos_categoria = listagastos.filter((pro) => pro.categoria === value)

        setOptionsgasto(lista_gastos_categoria.map(item => ({
            label: item.nombre_gasto,
            value: item.id
          })));
        
      };

    const SeleccionGasto = (value) => {
        setSelectedOptiongasto(value);
        setGastosel(value)
        
      };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
    
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };
    
    const handleConfirm = (date) => {
        
        const fechaFormateada = new Date(date).toISOString().split('T')[0]
        // console.warn("Fecha Formateada: ", fechaFormateada);
        setFechaegreso(fechaFormateada)
        hideDatePicker();
      };
    useEffect(() => {

        const cargardatos=async()=>{
            const datestorage=await Handelstorage('obtenerdate');
            const mes_storage=datestorage['datames']
            const anno_storage=datestorage['dataanno']
            setMesprincipal(mes_storage)
            setAnnoprincipal(anno_storage)
            const body = {};
            const endpoint='MisDatosRegistroEgreso/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            const respuesta=result['resp']
            if (respuesta === 200){
                //console.log(result['data']['datoscategorias'])
                // console.log(result['data']['datosgastos'])

                

                setOptionscategoria(result['data']['datoscategorias'].map(item => ({
                    label: item.nombre_categoria,
                    value: item.id
                  })));

                

                setListagastos(result['data']['datosgastos'])
                
            }else{
                console.log(respuesta)
            }
            

           
        }
        cargardatos()
      }, []);


      const registrar_egreso = async () => {
        
        const datosregistrar = {
            codgasto:0,
            gasto:gasttosel,
            monto:parseInt(monto,10),
            fecha:fechaegreso,
            anotacion:anotacion,
            

        };
        console.log(datosregistrar)
        const endpoint='RegistroEgreso/'
        const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
        
        const respuesta=result['resp']
        if (respuesta === 200) {
          const registros=result['data']['datos']
          cerrar()
          
        } else if(respuesta === 403 || respuesta === 401){
          
          console.log('error')

        }else {
          
          cpnsole.log(result['data']['error'])
        }
     };
    return(
        <Modal visible={visible} onDismiss={cerrar} contentContainerStyle={containerStyle}>
            <Text>Nuevo Registro.</Text>
            <Divider />
            <RNPickerSelect
            onValueChange={SeleccionCategoria}
            items={optionscategoria}
            
            value={selectedOptioncategoria}
            placeholder={{ label: 'Categoria', value: null }}
            style={{ fontSize: 5 }}
            />

            <RNPickerSelect
                        onValueChange={SeleccionGasto}
                        items={optionsgasto}
                        value={selectedOptiongasto}
                        
                        placeholder={{ label: 'Gasto', value: null }}
                        />
            
            
            <TextInput
                        placeholder='Monto Gasto' 
                        value={monto} 
                        onChangeText={monto => setMonto(monto)}/>
                
            
            

            <Button title="Show Date Picker" onPress={showDatePicker} />
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <TextInput 
                    placeholder='Observacion' 
                    value={anotacion}
                    onChangeText={anotacion => setAnotacion(anotacion)}/>

            <Button title="PROCESAR" onPress={registrar_egreso} />
            <Button title="CANCELAR" onPress={cerrar} />

        </Modal>
    )
}
const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 5,
      },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      backgroundColor:'rgba(128, 128, 128,0.3)',
      borderRadius: 5,
      padding: 5,
      fontSize: 15,
    },
  });
export default GastoModal