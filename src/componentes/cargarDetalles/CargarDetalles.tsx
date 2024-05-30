
import { useEffect, useState }from "react";
import ArticuloManufacturado from '../../entidades/ArticuloManufacturado';
import ArticuloManufacturadoDetalle from '../../entidades/ArticuloManufacturadoDetalle';
import RecetaInsumoForm from "./RecetaInsumoForm";
import { Modal } from "react-bootstrap";
import BtnDelete from "../btnDelete/BtnDelete";

function CargarDetalles({ articulo, handleChange }: { articulo:ArticuloManufacturado, handleChange: (key: keyof object, value: any) => void}) {
    const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle []>([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    }

    const actualizarDetalles = (detallesEnviados: ArticuloManufacturadoDetalle[]) => {
        handleChange("articuloManufacturadoDetalles" as keyof object, detallesEnviados);
    };

    const deleteDetalle = (id:number) => {
        handleChange("articuloManufacturadoDetalles" as keyof object, [...detalles.filter((_detalle, index) => index !== id)]);
    }

    useEffect(() => {
        setDetalles(articulo.articuloManufacturadoDetalles);
    }, [articulo]);

    return (
    <div className="mb-3">

        <Modal className="modal-xl" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Detalles</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <RecetaInsumoForm detallesPrevios={detalles} onDetallesChange={actualizarDetalles} handleCloseModal={handleClose}/>
            </Modal.Body>
        </Modal>

        <div className="p-3 border rounded">
        <div className="d-flex justify-content-center" style={{height:'248px', overflowY:'auto'}}>
        <table className='table stripped' style={{width:'98%'}}>
            <thead style={{position:'sticky', top:'0', zIndex:'1'}}>
                <tr>
                    <th colSpan={4}>
                        <div className='row'>
                        <button type="button" className='btn btn-secondary' onClick={handleShow}>Agregar</button>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
            {detalles.map((detalle, index) => (
                <tr key={index}>
                    <td style={{width:"60%"}}>{detalle.articuloInsumo.denominacion}</td>
                    <td style={{width:"5%", textAlign:'center'}}>{detalle.cantidad}</td>
                    <td style={{width:"10%", textAlign:'center'}}>{detalle.articuloInsumo.unidadMedida.denominacion}</td>
                    <td style={{width:"25%", textAlign:'center'}}><BtnDelete handleClick={() => deleteDetalle(index)} /></td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        <div className="fw-bold">
            Costo Total: ${detalles.reduce((sum, current) => sum + current.cantidad * current.articuloInsumo.precioCompra, 0).toLocaleString('es-AR')}
        </div>
        </div>
    </div>
    );
}

export default CargarDetalles;