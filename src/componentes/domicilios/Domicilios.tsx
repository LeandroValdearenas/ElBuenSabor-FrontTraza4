import { useState } from "react";
import '../../slick-theme.css';
import Domicilio from '../../entidades/Domicilio';
import MostrarDomicilio from "./MostrarDomicilio";
import DomicilioForm from "./DomicilioForm";
import { Button, Modal } from "react-bootstrap";

type DomiciliosArgs = {
    domicilios: Domicilio[],
    editar?: boolean,
    handleChange: (key: keyof object, value: any) => void
}

function Domicilios({ domicilios, editar = false, handleChange }: DomiciliosArgs) {
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState<Domicilio>(new Domicilio());
    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState<{ [key in keyof Domicilio]?: string }>({});

    const handleDomicilioChange = (_key: keyof Domicilio, value: any) => {
        const domicilioNuevo = value;
        domicilioNuevo.id = domicilioSeleccionado.id;
        setDomicilioSeleccionado(domicilioNuevo);
    }

    const handleClose = () => setShow(false);
    const handleShow = (datos?: Domicilio) => {
        const seleccionado = new Domicilio();
        if (datos) {
            Object.assign(seleccionado, datos);
        }
        setDomicilioSeleccionado(seleccionado);
        setShow(true);
    }

    const handleDomicilioUpdate = () => {
        const erroresNuevos = { calle: '', localidad: '', provincia: '', numero: '', cp: '' };
        if (domicilioSeleccionado.calle === '') {
            erroresNuevos['calle'] = 'Debe ingresar calle';
        }
        if (domicilioSeleccionado.localidad.id === 0) {
            erroresNuevos['localidad'] = 'Debe ingresar la localidad';
        }
        if (domicilioSeleccionado.localidad.provincia.id === 0) {
            erroresNuevos['provincia'] = 'Debe ingresar la provincia';
        }
        if (domicilioSeleccionado.numero <= 0) {
            erroresNuevos['numero'] = 'Ingrese un número válido';
        } else if (domicilioSeleccionado.numero >= 100000) {
            erroresNuevos['numero'] = 'El número de la calle es demasiado grande. limítese a 5 cifras';
        }
        if (domicilioSeleccionado.cp <= 0) {
            erroresNuevos['cp'] = 'Ingrese código postal válido';
        } else if (domicilioSeleccionado.cp >= 100000) {
            erroresNuevos['cp'] = 'El código postal es demasiado grande. limítese a 5 cifras';
        }
        setErrors(erroresNuevos);
        if (erroresNuevos['calle'] || erroresNuevos['localidad'] || erroresNuevos['numero'] || erroresNuevos['cp']) {
            return
        }

        handleClose();
        handleChange('domicilios' as keyof object, [...domicilios.filter(domicilio => domicilio.id !== domicilioSeleccionado.id), domicilioSeleccionado].sort((a, b) => a.id - b.id));
    }

    const handleDomicilioDelete = (id: number) => {
        handleChange('domicilios' as keyof object, [...domicilios.filter(domicilio => domicilio.id !== id)].sort((a, b) => a.id - b.id));
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Domicilio</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <DomicilioForm domicilio={domicilioSeleccionado} errors={errors} handleChangeDomicilio={handleDomicilioChange} />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleDomicilioUpdate}>
                        Enviar
                    </Button>
                </Modal.Footer>
            </Modal>

            <div style={{ overflowY: "scroll", height: "276px" }}>
                <div className="mx-3" >
                    {domicilios.map((domicilio) =>
                        <MostrarDomicilio key={domicilio.id} handleOpenModal={handleShow} domicilioPrevio={domicilio} editar={editar} handleDelete={handleDomicilioDelete} />
                    )}
                </div>
            </div>

            {editar &&
                <div className="row mx-1 mt-3">
                    <button type='button' className="btn btn-sm btn-secondary" onClick={() => handleShow(new Domicilio)}>Nuevo</button>
                </div>
            }

        </>
    );
}

export default Domicilios;