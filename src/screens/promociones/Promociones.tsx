import * as React from 'react';
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Promocion from "../../entidades/Promocion";
import PromocionService from "../../servicios/PromocionService";
import { useAtributos } from "../../hooks/useAtributos";
import CboBoxFiltrar from "../../componentes/cboBoxFiltrar/CboBoxFiltrar";
import { useParams } from "react-router-dom";
import SearchBar from "../../componentes/searchBar/SearchBar";
import { Button, Form, Modal } from "react-bootstrap";
import CargarImagenes from "../../componentes/cargarImagenes/CargarImagenes";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BtnEdit from '../../componentes/btnEdit/BtnEdit';
import BtnDelete from '../../componentes/btnDelete/BtnDelete';
import CargarDetallesPromocion from '../../componentes/cargarDetalles/CargarDetallesPromocion';
import Sucursal from '../../entidades/Sucursal';
import Slider from 'react-slick';


const Promociones = () => {
    const [promocion, setPromocion] = useState<Promocion>(new Promocion());
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const [show, setShow] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const { setNombreApartado } = useAtributos();
    const { idsucursal } = useParams<{ idsucursal: string }>();
    const [errors, setErrors] = useState<{ [key in keyof Promocion]?: string }>({});

    const urlapi = import.meta.env.VITE_API_URL;
    const promocionService = new PromocionService(urlapi + "/promociones");

    const getPromocionesRest = useCallback(async (tipoPromocion?: string) => {
        try {
          const datos: Promocion[] = await promocionService.getAll();
          const promocionesFiltrados = (tipoPromocion 
            ? datos.filter(promocion => promocion.tipoPromocion === tipoPromocion) 
            : datos).filter(promocion => busqueda ? promocion.denominacion.toLowerCase().includes(busqueda.toLowerCase()) : true);
        
          setPromociones(promocionesFiltrados);
        } catch (error) {
          console.error("Error al buscar los datos", error);
        }
      }, [busqueda, promocionService, idsucursal]);
      
      

    const deletePromocion = async (idPromocion: number) => {
        try{
            await promocionService.delete(idPromocion);
            getPromocionesRest();
        } catch {
            alert("No se pudo borrar la promoción, verifique que no esté siendo usada en otros datos.");
        }
    }

    const handleBusqueda = () => {
        getPromocionesRest();
    }

    const handleChangeTipoPromocion = (e: ChangeEvent<HTMLSelectElement>) => {
        const tipoSeleccionado = e.target.selectedOptions[0].text;
        if (e.target.value === '0') {
            getPromocionesRest();
        } else {
            getPromocionesRest(tipoSeleccionado);
        }
    }

    const handleClose = () => {
        setShow(false);
        setErrors({});
    }

    const handleShow = (datos?: Promocion) => {
        const seleccionado = new Promocion();
        if (datos) {
            Object.assign(seleccionado, datos);
        }
        setPromocion(seleccionado);
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
        } else if (id === 'imagenes' || id === 'categoria' || id === 'unidadMedida') {
            value = { id: Number(e.target.value) };
        } else {
            value = e.target.value;
        }
        setPromocion(prevState => ({
            ...prevState,
            [id]: value
        }));
    }

    const handleSave = useCallback(async () => {
        // Validación
        const erroresNuevos : {[key in keyof Promocion]?: string} = {}
        for (const key in Promocion) {
            if (Promocion.hasOwnProperty(key)) {
                erroresNuevos[key] = '';
            }
        }

        // Atributos de Promociones
        if (promocion.denominacion === '') {
            erroresNuevos['denominacion'] = 'Debe ingresar la denominación';
        }
        if (promocion.descripcionDescuento === '') {
            erroresNuevos['descripcionDescuento'] = 'Debe ingresar una descripción del producto';
        }
        if (String(promocion.fechaDesde) === '' || String(promocion.horaHasta).length > 10) {
            erroresNuevos['fechaDesde'] = 'Debe ingresar la fecha de inicio de la promoción';
        }
        if (String(promocion.fechaHasta) === '' || String(promocion.horaHasta).length > 10) {
            erroresNuevos['fechaHasta'] = 'Debe ingresar la fecha de finalizado de la promoción ';
        }
        if (String(promocion.horaDesde) === '' || String(promocion.horaHasta).length > 8) {
            erroresNuevos['horaDesde'] = 'Debe ingresar el horario de inicio de la promoción';
        }
        if (String(promocion.horaHasta) === '' || String(promocion.horaHasta).length > 8) {
            erroresNuevos['horaHasta'] = 'Debe ingresar el horario de finalizado de la promoción';
        }
        if (promocion.fechaDesde >= promocion.fechaHasta) {
            if (promocion.fechaDesde > promocion.fechaHasta) {
                erroresNuevos['fechaHasta'] = 'La fecha final no puede superar la fecha inicial';
            } else if (promocion.horaDesde > promocion.horaHasta) {
                erroresNuevos['horaHasta'] = 'La hora final no puede superar la hora inicial del mismo día';
            }
        }
        if (promocion.precioPromocional < 0) {
            erroresNuevos['precioPromocional'] = 'Debe ingresar el precio promocional que sea mayor o igual a cero';
        } else if (promocion.precioPromocional >= 1000000000) {
            erroresNuevos['precioPromocional'] = 'El precio promocional no puede ser tan alto. limítese a 9 cifras';
        }
        if (promocion.tipoPromocion === '') {
            erroresNuevos['tipoPromocion'] = 'Debe ingresar el tipo de promoción';
        }
        if (promocion.promocionDetalles.length === 0) {
            erroresNuevos['promocionDetalles'] = 'Debe ingresar al menos un artículo en la promoción';
        }
        
        setErrors(erroresNuevos);
        if (Object.keys(erroresNuevos).some(key => (erroresNuevos as any)[key].length > 0)) {
            return
        }

        if (promocion.id === 0) {
            promocion.sucursales = [{ id: idsucursal } as unknown as Sucursal];
            await promocionService.post(promocion);
        } else {
            await promocionService.put(promocion.id, promocion);
        }
        getPromocionesRest();
        handleClose();
    }, [promocionService, promocion, getPromocionesRest]);

    useEffect(() => {
        getPromocionesRest();
        setNombreApartado('Promociones');
    }, []);

    function Row(props: { row: Promocion }) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);
        const settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 7,
            slidesToScroll: 1,
            responsive: [
              {
                breakpoint: 1440,
                settings: {
                  slidesToShow: 7,
                  slidesToScroll: 1,
                },
              },
              {
                breakpoint: 1200,
                settings: {
                  slidesToShow: 5,
                  slidesToScroll: 1,
                },
              },
              {
                breakpoint: 991,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 1,
                },
              },
              {
                breakpoint: 576,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                },
              }
            ],
          };
        return (
          <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
              <TableCell>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
                                    
              <TableCell>{row.denominacion}</TableCell>
              <TableCell>{row.tipoPromocion}</TableCell>
              <TableCell>
                {row.fechaDesde.toLocaleString('es-AR').split('-').reverse().join('/')} {String(row.horaDesde).slice(0, 5)} - {row.fechaHasta.toLocaleString('es-AR').split('-').reverse().join('/')} {String(row.horaHasta).slice(0, 5)}
              </TableCell>
              <TableCell align="right">${row.precioPromocional.toLocaleString('es-AR')}</TableCell>
              <TableCell style={{width:'10%'}} align="center">
                <div className='d-flex justify-content-between' >
                    <BtnEdit handleClick={() => (handleShow(row))} />
                    <BtnDelete handleClick={() => (deletePromocion(row.id))}/>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Detalles de la Promoción
                    </Typography>
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell>Artículo</TableCell>
                          <TableCell align="right">Cantidad</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.promocionDetalles?.map((promocionDetalle) => (
                          <TableRow key={promocionDetalle.id}>
                            <TableCell component="th" scope="row">{promocionDetalle.articulo.denominacion}</TableCell>
                            <TableCell align="right">{promocionDetalle.cantidad!.toLocaleString('es-AR')} {promocionDetalle.articulo.unidadMedida.denominacion}</TableCell>
                           </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                  <Box sx={{ margin: 1 }}>
                    <div style={{width:'86vw'}}>
                        <Slider className='px-4 text-center mb-4' {...settings}>
                        {row.imagenes.map((imagen, index) => (
                            <div key={index}>
                            <img src={imagen.url} alt={`Imagen ${index}`} style={{ width: '100px', height: '100px' }} />
                            </div>
                        ))}
                        </Slider>
                    </div>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        );
      }

    return (
        <div className="m-3">
            <Modal show={show} onHide={handleClose} className='modal-xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Promocion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className='row'>
                        <div className='col-sm col-md col-lg d-flex flex-column justify-content-between'>

                        <Form.Group className="mb-3" controlId="denominacion">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={promocion.denominacion}
                                autoFocus
                                onChange={handleInputChange}
                                required
                            />
                            {errors['denominacion'] && <div className='ms-1 mt-1 text-danger'>{errors['denominacion']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="tipoPromocion">
                            <Form.Label>Tipo de Promoción</Form.Label>
                            <Form.Control
                                as="select"
                                value={promocion.tipoPromocion}
                                onChange={handleInputChange}
                            >
                                <option key={0} value='' disabled>Seleccione una opción</option>
                                <option key={1} value='HappyHour'>Happy Hour</option>
                                <option key={2} value='Promocion'>Promoción</option>
                            </Form.Control>
                            
                            {errors['tipoPromocion'] && <div className='ms-1 mt-1 text-danger'>{errors['tipoPromocion']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="descripcionDescuento">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={promocion.descripcionDescuento}
                                onChange={handleInputChange}
                            />
                            {errors['descripcionDescuento'] && <div className='ms-1 mt-1 text-danger'>{errors['descripcionDescuento']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="fechaDesde">
                            <Form.Label>Fecha desde:</Form.Label>
                            <Form.Control
                                type="date"
                                value={String(promocion.fechaDesde)}
                                onChange={handleInputChange}
                            />
                            {errors['fechaDesde'] && <div className='ms-1 mt-1 text-danger'>{errors['fechaDesde']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="fechaHasta">
                            <Form.Label>Fecha hasta:</Form.Label>
                            <Form.Control
                                type="date"
                                value={String(promocion.fechaHasta)}
                                onChange={handleInputChange}
                            />
                            {errors['fechaHasta'] && <div className='ms-1 mt-1 text-danger'>{errors['fechaHasta']}</div>}
                        </Form.Group>
                        </div>
                        <div className='col-sm col-md col-lg d-flex flex-column justify-content-between'>
                        
                        <Form.Group className="mb-3" controlId="horaDesde">
                            <Form.Label>Hora desde:</Form.Label>
                            <Form.Control
                                type="time"
                                value={String(promocion.horaDesde)}
                                onChange={handleInputChange}
                            />
                            {errors['horaDesde'] && <div className='ms-1 mt-1 text-danger'>{errors['horaDesde']}</div>}
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="horaHasta">
                            <Form.Label>Hora hasta:</Form.Label>
                            <Form.Control
                                type="time"
                                value={String(promocion.horaHasta)}
                                onChange={handleInputChange}
                            />
                            {errors['horaHasta'] && <div className='ms-1 mt-1 text-danger'>{errors['horaHasta']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="precioPromocional">
                            <Form.Label>Precio Promocional</Form.Label>
                            <Form.Control
                                type="number"
                                value={promocion.precioPromocional}
                                min={0}
                                step={0.1}
                                onChange={handleInputChange}
                            />
                            {errors['precioPromocional'] && <div className='ms-1 mt-1 text-danger'>{errors['precioPromocional']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="promocionDetalles">
                            <Form.Label>Cargar Receta</Form.Label>
                            <CargarDetallesPromocion promocion={promocion} handleChange={(key, value) => setPromocion(prevState => ({
                                ...prevState,
                                [key]: value
                            }))} />
                        {errors['promocionDetalles'] && <div className='ms-1 mt-1 text-danger'>{errors['promocionDetalles']}</div>}
                        </Form.Group>
                        </div>

                        <Form.Group className="mb-3" controlId="imagenes">
                            <Form.Label>Imágenes</Form.Label>
                            <CargarImagenes imagenes={promocion.imagenes} handleChange={(key, value) => setPromocion(prevState => ({
                                ...prevState,
                                [key]: value
                            }))} />
                        </Form.Group>
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
                        <CboBoxFiltrar
                            idCboInput="TipoPromocion"
                            titulo="Tipo de Promoción"
                            datos={[{id:1, denominacion:"HappyHour"},{id:2, denominacion:"Promocion"}]}
                            handleChange={handleChangeTipoPromocion}
                        />
                        <a className="ms-5 me-5 btn btn-lg btn-primary" style={{ height: '44px', fontSize: '18px' }} onClick={() => handleShow()}>
                            Nuevo
                        </a>
                    </div>
                </div>

                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Denominacion</TableCell>
                            <TableCell>Tipo de Promoción</TableCell>
                            <TableCell>Fecha desde / hasta</TableCell>
                            <TableCell align="right">Precio Promocional</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {promociones.map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default Promociones;