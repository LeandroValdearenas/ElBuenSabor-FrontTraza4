import * as React from 'react';
import { useCallback, useEffect, useState } from "react";
import Empleado from "../../entidades/Empleado";
import EmpleadoService from "../../servicios/EmpleadoService";
import { useAtributos } from "../../hooks/useAtributos";
import SearchBar from "../../componentes/searchBar/SearchBar";
import { Button, Form, Modal } from "react-bootstrap";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CargarImagen from '../../componentes/cargarImagenes/CargarImagen';
import BtnDelete from '../../componentes/btnDelete/BtnDelete';
import BtnEdit from '../../componentes/btnEdit/BtnEdit';
import DomicilioForm from '../../componentes/domicilios/DomicilioForm';
import Sucursal from '../../entidades/Sucursal';
import { useParams } from 'react-router-dom';

const Empleados = () => {
    const [empleado, setEmpleado] = useState<Empleado>(new Empleado());
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [show, setShow] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const { setNombreApartado } = useAtributos();
    const { idsucursal } = useParams();
    const [errors, setErrors] = useState<{ [key in keyof Empleado]?: string }>({});

    const urlapi = import.meta.env.VITE_API_URL;
    const empleadoService = new EmpleadoService(urlapi + "/empleados");

    const getEmpleadosRest = async () => {
        const datos: Empleado[] = busqueda ? await empleadoService.buscarXNombre(busqueda) : await empleadoService.getAll();
        const empleadosFiltrados = datos//.filter(empleado => empleado.sucursal.id === Number(idsucursal));
        setEmpleados(empleadosFiltrados);
    }

    const deleteEmpleado = async (idEmpleado: number) => {
        try {
            await empleadoService.delete(idEmpleado);
            getEmpleadosRest();
        } catch {
            alert("No se pudo eliminar el empleado. Asegúrese de que no esté siendo usado antes de eliminarlo.");
        }
    }

    const handleBusqueda = () => {
        getEmpleadosRest();
    }

    const handleClose = () => {
        setShow(false);
        setErrors({});
    }

    const handleShow = (datos?: Empleado) => {
        const seleccionado = new Empleado();
        if (datos) {
            Object.assign(seleccionado, datos);
        }
        setEmpleado(seleccionado);
        setShow(true);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const id = e.target.id;
        errors[id] = '';
        let value: any;
        if (e.target.type === 'text') {
            value = String(e.target.value);
        } else if (e.target.type === 'number') {
            value = Number(e.target.value);
        } else if (e.target.id === 'imagenes' || e.target.id === 'domicilio') {
            value = { id: Number(e.target.value) };
        } else {
            value = String(e.target.value);
        }
        setEmpleado(prevState => ({
            ...prevState,
            [id]: value
        }));
    }

    const handleSave = useCallback(async () => {
        // Validación
        const erroresEmpleado: { [key in keyof Empleado]?: string } = {}
        for (const key in Empleado) {
            if (Empleado.hasOwnProperty(key)) {
                erroresEmpleado[key] = '';
            }
        }
        const erroresNuevos = { ...erroresEmpleado, calle: '', localidad: '', numero: '', cp: '' };

        // Atributos de Empleado
        if (empleado.nombre === '') {
            erroresNuevos['nombre'] = 'Debe ingresar el nombre del empleado';
        }
        if (empleado.apellido === '') {
            erroresNuevos['apellido'] = 'Debe ingresar el apellido del empleado';
        }
        if (empleado.rol === '') {
            erroresNuevos['rol'] = 'Debe ingresar el rol del empleado';
        }
        if (empleado.telefono === '') {
            erroresNuevos['telefono'] = 'Debe ingresar el teléfono  del empleado';
        }
        if (empleado.email === '') {
            erroresNuevos['email'] = 'Debe ingresar el E-mail del empleado';
        }
        if (String(empleado.fechaNacimiento) === '' || empleado.fechaNacimiento.toString().length > 10) {
            erroresNuevos['fechaNacimiento'] = 'Debe ingresar la fecha de nacimiento del empleado';
        }

        // Domicilio
        if (empleado.domicilio.calle === '') {
            erroresNuevos['calle'] = 'Debe ingresar calle';
        }
        if (empleado.domicilio.localidad.nombre === '') {
            erroresNuevos['localidad'] = 'Debe ingresar localidad';
        } else if (empleado.domicilio.localidad.id === 0) {
            erroresNuevos['localidad'] = 'No se encontró la localidad';
        }
        if (empleado.domicilio.numero <= 0) {
            erroresNuevos['numero'] = 'Ingrese un número válido';
        } else if (empleado.domicilio.numero >= 100000) {
            erroresNuevos['numero'] = 'El número de calle es demasiado grande. limítese a 5 cifras';
        }
        if (empleado.domicilio.cp <= 0) {
            erroresNuevos['cp'] = 'Ingrese código postal válido';
        } else if (empleado.domicilio.cp >= 100000) {
            erroresNuevos['cp'] = 'El código postal es demasiado grande. limítese a 5 cifras';
        }

        setErrors(erroresNuevos);
        if (Object.keys(erroresNuevos).some(key => (erroresNuevos as any)[key].length > 0)) {
            return
        }

        empleado.pedidos = [];
        empleado.sucursal = { id: idsucursal } as unknown as Sucursal;

        if (empleado.id === 0) {
            await empleadoService.post(empleado);
        } else {
            await empleadoService.put(empleado.id, empleado);
        }
        getEmpleadosRest();
        handleClose();
    }, [empleadoService, empleado, getEmpleadosRest]);

    useEffect(() => {
        getEmpleadosRest();
        setNombreApartado('Empleados');
    }, []);

    function Row(props: { row: Empleado }) {
        const { row } = props;
        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell align="center">{row.rol}</TableCell>
                    <TableCell align="center">{row.nombre} {row.apellido}</TableCell>
                    <TableCell align="center">{row.telefono}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">{row.fechaNacimiento.toLocaleString('es-AR')}</TableCell>
                    <TableCell align="center">{row.domicilio.calle} {row.domicilio.numero}</TableCell>
                    <TableCell style={{ width: '10%' }} align="center">
                        <div className='d-flex justify-content-between' >
                            <BtnEdit handleClick={() => (handleShow(row))} />
                            <BtnDelete handleClick={() => (deleteEmpleado(row.id))} />
                        </div>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }


    return (
        <div className="m-3">

            <Modal show={show} onHide={handleClose} className='modal-xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Empleado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className='row'>
                            <div className='col-lg d-flex flex-column justify-content-between'>
                                <Form.Group className="mb-3" controlId="imagen">
                                    <Form.Label>Imágen</Form.Label>
                                    <CargarImagen imagen={empleado.imagen} handleChange={(key, value) => setEmpleado(prevState => ({
                                        ...prevState,
                                        [key]: value
                                    }))} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="domicilio">
                                    <Form.Label>Domicilio</Form.Label>
                                    <DomicilioForm domicilio={empleado.domicilio} errors={errors} handleChangeDomicilio={(key, value) => setEmpleado(prevState => ({
                                        ...prevState,
                                        [key]: value
                                    }))} />
                                </Form.Group>
                            </div>
                            <div className='col-lg d-flex flex-column justify-content-between'>
                                <Form.Group className="mb-3" controlId="nombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={empleado.nombre}
                                        autoFocus
                                        onChange={handleInputChange}
                                        required
                                    />

                                    {errors['nombre'] && <div className='ms-1 mt-1 text-danger'>{errors['nombre']}</div>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="apellido">
                                    <Form.Label>Apellido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={empleado.apellido}
                                        onChange={handleInputChange}
                                        required
                                    />

                                    {errors['apellido'] && <div className='ms-1 mt-1 text-danger'>{errors['apellido']}</div>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="rol">
                                    <Form.Label>Rol</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={empleado.rol}
                                        onChange={handleInputChange}
                                    >
                                        <option key={0} value='' disabled>Seleccione una opción</option>
                                        <option key={1} value='Administrador'>Administrador</option>
                                        <option key={2} value='Cajero'>Cajero</option>
                                        <option key={3} value='Cocinero'>Cocinero</option>
                                        <option key={4} value='Delivery'>Delivery</option>
                                    </Form.Control>

                                    {errors['rol'] && <div className='ms-1 mt-1 text-danger'>{errors['rol']}</div>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="telefono">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        value={empleado.telefono}
                                        onChange={handleInputChange}
                                        required
                                    />

                                    {errors['telefono'] && <div className='ms-1 mt-1 text-danger'>{errors['telefono']}</div>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={empleado.email}
                                        onChange={handleInputChange}
                                        required
                                    />

                                    {errors['email'] && <div className='ms-1 mt-1 text-danger'>{errors['email']}</div>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="fechaNacimiento">
                                    <Form.Label>Fecha de Nacimiento</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={empleado.fechaNacimiento.toString()}
                                        onChange={handleInputChange}
                                        required
                                    />

                                    {errors['fechaNacimiento'] && <div className='ms-1 mt-1 text-danger'>{errors['fechaNacimiento']}</div>}
                                </Form.Group>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Enviar
                    </Button>
                </Modal.Footer>
            </Modal>

            <div>
                <div className='d-flex justify-content-between'>
                    <SearchBar setBusqueda={setBusqueda} handleBusqueda={handleBusqueda} />

                    <div className="col mb-3 mt-auto d-flex justify-content-end">
                        <a className="ms-5 me-5 btn btn-lg btn-primary" style={{ height: '44px', fontSize: '18px' }} onClick={() => handleShow()}>
                            Nuevo
                        </a>
                    </div>
                </div>

                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Rol</TableCell>
                                <TableCell align="center">Nombre</TableCell>
                                <TableCell align="center">Teléfono</TableCell>
                                <TableCell align="center">E-mail</TableCell>
                                <TableCell align="center">Fecha de Nacimiento</TableCell>
                                <TableCell align="center">Domicilio</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {empleados.map((row) => (
                                <Row key={row.id} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
        </div>
    )
}

export default Empleados;