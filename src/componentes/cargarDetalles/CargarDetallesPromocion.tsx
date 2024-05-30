
import { useEffect, useState }from "react";
import Promocion from '../../entidades/Promocion';
import PromocionDetalle from '../../entidades/PromocionDetalle';
import { Modal } from "react-bootstrap";
import BtnDelete from "../btnDelete/BtnDelete";
import PromocionArticuloForm from "./PromocionArticuloForm";

function CargarDetallesPromocion({ promocion, handleChange }: { promocion:Promocion, handleChange: (key: keyof object, value: any) => void}) {
    const [detalles, setDetalles] = useState<PromocionDetalle []>([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    }

    const actualizarDetalles = (detallesEnviados: PromocionDetalle[]) => {
        handleChange("promocionDetalles" as keyof object, detallesEnviados);
    };

    const deleteDetalle = (id:number) => {
        handleChange("promocionDetalles" as keyof object, [...detalles.filter((_detalle, index) => index !== id)]);
    }

    useEffect(() => {
        setDetalles(promocion.promocionDetalles);
    }, [promocion]);

    return (
    <div className="mb-3">

        <Modal className="modal-xl" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Detalles</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <PromocionArticuloForm detallesPrevios={detalles} onDetallesChange={actualizarDetalles} handleCloseModal={handleClose}/>
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
                    <td style={{width:"60%"}}>{detalle.articulo.denominacion}</td>
                    <td style={{width:"5%", textAlign:'center'}}>{detalle.cantidad}</td>
                    <td style={{width:"10%", textAlign:'center'}}>{detalle.articulo.unidadMedida.denominacion}</td>
                    <td style={{width:"25%", textAlign:'center'}}><BtnDelete handleClick={() => deleteDetalle(index)} /></td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        <div className="fw-bold">
            Costo Total: ${detalles.reduce((sum, current) => sum + current.cantidad * current.articulo.precioVenta, 0).toLocaleString('es-AR')}
        </div>
        </div>
    </div>
    );
}

export default CargarDetallesPromocion;