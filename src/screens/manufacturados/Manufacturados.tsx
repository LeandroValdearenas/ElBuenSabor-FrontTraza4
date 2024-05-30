import * as React from 'react';
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import ArticuloManufacturado from "../../entidades/ArticuloManufacturado";
import ArticuloManufacturadoService from "../../servicios/ArticuloManufacturadoService";
import { useAtributos } from "../../hooks/useAtributos";
import CboBoxFiltrar from "../../componentes/cboBoxFiltrar/CboBoxFiltrar";
import { useParams } from "react-router-dom";
import SearchBar from "../../componentes/searchBar/SearchBar";
import { Button, Form, Modal } from "react-bootstrap";
import CargarImagenes from "../../componentes/cargarImagenes/CargarImagenes";
import CargarDetalles from "../../componentes/cargarDetalles/CargarDetalles";
import Categoria from "../../entidades/Categoria";
import UnidadMedida from "../../entidades/UnidadMedida";
import CategoriasForm from "../categorias/CategoriasForm";
import UnidadesMedidaForm from "../unidadesMedida/UnidadesMedidaForm";
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
import SucursalService from '../../servicios/SucursalService';
import Sucursal from '../../entidades/Sucursal';
import BtnAddCategory from '../../componentes/btnAddCategory/BtnAddCategory';
import StockManufacturado from '../../entidades/StockManufacturado';
import BtnEdit from '../../componentes/btnEdit/BtnEdit';
import BtnDelete from '../../componentes/btnDelete/BtnDelete';
import Slider from 'react-slick';


const ArticulosManufacturados = () => {
    const [articuloManufacturado, setArticuloManufacturado] = useState<ArticuloManufacturado>(new ArticuloManufacturado());
    const [manufacturados, setManufacturados] = useState<ArticuloManufacturado[]>([]);
    const [categoriasFiltradas, setCategoriasFiltradas] = useState<Categoria[]>([]);
    const [show, setShow] = useState(false);
    const [showCategorias, setShowCategorias] = useState<boolean>(false);
    const [showUnidadesMedida, setShowUnidadesMedida] = useState<boolean>(false);
    const [busqueda, setBusqueda] = useState('');
    const { setNombreApartado } = useAtributos();
    const { idsucursal } = useParams<{ idsucursal: string }>();
    const [errors, setErrors] = useState<{ [key in keyof ArticuloManufacturado]?: string }>({});

    const { categorias, unidadesMedida, getCategoriasRest, getUnidadesMedidaRest } = useAtributos();

    const urlapi = import.meta.env.VITE_API_URL;
    const articuloManufacturadoService = new ArticuloManufacturadoService(urlapi + "/manufacturados");
    const sucursalService = new SucursalService(urlapi + "/sucursales");

    const getManufacturadosRest = useCallback(async (categoriaId?: number) => {
        try {
          const sucursales: Sucursal[] = await sucursalService.getAll();
          const datos: ArticuloManufacturado[] = busqueda 
            ? await articuloManufacturadoService.buscarXDenominacion(busqueda) 
            : await articuloManufacturadoService.getAll();
      
          for (const articulo of datos) {
            if (!articulo.stocksManufacturado) {
                articulo.stocksManufacturado = [];
              }
            for (const sucursal of sucursales) {
              const art: ArticuloManufacturado[] = await articuloManufacturadoService.buscarXSucursal(Number(sucursal.id));
              const stock = new StockManufacturado();
              stock.sucursal = sucursal;
              stock.stockActual = art.filter(a => a.id === articulo.id).map(a => a.stockActual).reduce((acc, curr) => acc + curr, 0);
              articulo.stocksManufacturado.push(stock);
            }
          }
      
          const manufacturadosFiltrados = categoriaId 
            ? datos.filter(manufacturado => manufacturado.categoria.id === categoriaId) 
            : datos;
      
          setManufacturados(manufacturadosFiltrados);
        } catch (error) {
          console.error("Error al buscar los datos", error);
        }
      }, [busqueda, articuloManufacturadoService, idsucursal]);
      
      

    const deleteManufacturado = async (idArticuloManufacturado: number) => {
        try{
            await articuloManufacturadoService.delete(idArticuloManufacturado);
            getManufacturadosRest();
        } catch {
            alert("No se pudo borrar el artículo, verifique que no esté siendo usada en otros datos.");
        }
    }

    const handleBusqueda = () => {
        getManufacturadosRest();
    }

    const handleChangeCategoria = (e: ChangeEvent<HTMLSelectElement>) => {
        getManufacturadosRest(Number(e.target.value));
    }

    const handleClose = () => {
      setShow(false);
      setErrors({});
    }
    
    const handleShow = (datos?: ArticuloManufacturado) => {
        const seleccionado = new ArticuloManufacturado();
        if (datos) {
            Object.assign(seleccionado, datos);
        }
        setArticuloManufacturado(seleccionado);
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
        setArticuloManufacturado(prevState => ({
            ...prevState,
            [id]: value
        }));
    }

    const handleSave = useCallback(async () => {
        // Validación
        const erroresNuevos : {[key in keyof ArticuloManufacturado]?: string} = {}
        for (const key in ArticuloManufacturado) {
            if (ArticuloManufacturado.hasOwnProperty(key)) {
                erroresNuevos[key] = '';
            }
        }

        // Atributos de Manufacturados
        if (articuloManufacturado.denominacion === '') {
            erroresNuevos['denominacion'] = 'Debe ingresar la denominación';
        }
        if (articuloManufacturado.categoria.id === 0) {
            erroresNuevos['categoria'] = 'Debe ingresar la categoría';
        }
        if (articuloManufacturado.descripcion === '') {
            erroresNuevos['descripcion'] = 'Debe ingresar una descripción del producto';
        }
        if (articuloManufacturado.tiempoEstimadoMinutos! < 0) {
            erroresNuevos['tiempoEstimadoMinutos'] = 'Debe ingresar el tiempo estimado de preparación del producto';
        } else if (articuloManufacturado.tiempoEstimadoMinutos >= 1000) {
            erroresNuevos['tiempoEstimadoMinutos'] = 'El tiempo estimado es demasiado grande. limítese a 3 cifras';
        }
        if (articuloManufacturado.precioVenta! < 0) {
            erroresNuevos['precioVenta'] = 'Debe ingresar un precio de venta válido, que sea mayor o igual a cero.';
        } else if (articuloManufacturado.precioVenta! >= 1000000000) {
            erroresNuevos['precioVenta'] = 'El precio de venta es demasiado grande. limítese a 9 cifras';
        }
        if (articuloManufacturado.unidadMedida.id === 0) {
            erroresNuevos['unidadMedida'] = 'Debe ingresar la unidad de medida';
        }
        if (articuloManufacturado.preparacion === '') {
            erroresNuevos['preparacion'] = 'Debe ingresar la preparación del producto';
        }
        if (articuloManufacturado.articuloManufacturadoDetalles.length === 0) {
            erroresNuevos['articuloManufacturadoDetalles'] = 'Debe definir al menos un ingrediente para el producto';
        }

        setErrors(erroresNuevos);
        if (Object.keys(erroresNuevos).some(key => (erroresNuevos as any)[key].length > 0)) {
            return
        }

        if (articuloManufacturado.id === 0) {
            await articuloManufacturadoService.post(articuloManufacturado);
        } else {
            await articuloManufacturadoService.put(articuloManufacturado.id, articuloManufacturado);
        }
        getManufacturadosRest();
        handleClose();
    }, [articuloManufacturadoService, articuloManufacturado, getManufacturadosRest]);

    useEffect(() => {
        getCategoriasRest();
        getManufacturadosRest();
        getUnidadesMedidaRest();
        setNombreApartado('Artículos Manufacturados');
    }, []);

    useEffect(() => {
      setCategoriasFiltradas(categorias.filter(categoria => manufacturados.some(manufacturado => manufacturado.categoria.id === categoria.id)));
    }, [categorias, manufacturados])

    function Row(props: { row: ArticuloManufacturado }) {
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
              },
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
              <TableCell component="th" scope="row">
                {row.denominacion}
              </TableCell>
                                    
              <TableCell align="right">${row.precioVenta.toLocaleString('es-AR')}</TableCell>
              <TableCell align="right">{row.tiempoEstimadoMinutos}</TableCell>
              <TableCell align="right">{row.categoria.denominacion}</TableCell>
              <TableCell style={{width:'10%'}} align="center">
                <div className='d-flex justify-content-between' >
                    <BtnEdit handleClick={() => (handleShow(row))} />
                    <BtnDelete handleClick={() => (deleteManufacturado(row.id))}/>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Preparación
                    </Typography>
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                        <TableCell component="th" scope="row">
                              {row.preparacion}
                            </TableCell>
                        </TableRow>
                      </TableHead>
                    </Table>
                  </Box>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Receta
                    </Typography>
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell>Insumo</TableCell>
                          <TableCell align="right">Cantidad</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.articuloManufacturadoDetalles?.map((manufacturadoDetalle) => (
                          <TableRow key={manufacturadoDetalle.id}>
                            <TableCell component="th" scope="row">{manufacturadoDetalle.articuloInsumo.denominacion}</TableCell>
                            <TableCell align="right">{manufacturadoDetalle.cantidad!.toLocaleString('es-AR')} {manufacturadoDetalle.articuloInsumo.unidadMedida.denominacion}</TableCell>
                           </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Stock por sucursal
                    </Typography>
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell>Sucursal</TableCell>
                          <TableCell align="right">Stock Actual</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.stocksManufacturado?.map((stockManufacturado) => (
                          <TableRow key={stockManufacturado.sucursal.id}>
                            <TableCell component="th" scope="row">
                              {stockManufacturado.sucursal.nombre}
                            </TableCell>
                            <TableCell align="right">{stockManufacturado.stockActual!.toLocaleString('es-AR')} {row.unidadMedida.denominacion}</TableCell>
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
                    <Modal.Title>Artículo Manufacturado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className='row'>
                        <div className='col-lg d-flex flex-column justify-content-between'>

                        <Form.Group className="mb-3" controlId="denominacion">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={articuloManufacturado.denominacion}
                                autoFocus
                                onChange={handleInputChange}
                                required
                            />
                            {errors['denominacion'] && <div className='ms-1 mt-1 text-danger'>{errors['denominacion']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="categoria">
                            <Form.Label>Categoría</Form.Label>
                            <div className="d-flex">
                            <Form.Control
                                as="select"
                                value={articuloManufacturado.categoria.id}
                                onChange={handleInputChange}
                            >
                                <option key={0} value='0' disabled>Seleccione una opción</option>
                                {categorias.map((categoria: Categoria) => (
                                    <option key={categoria.id} value={categoria.id}>{categoria.denominacion}</option>
                                ))}
                            </Form.Control>
                            <BtnAddCategory openModal={() => setShowCategorias(true)}/>
                            </div>
                            {errors['categoria'] && <div className='ms-1 mt-1 text-danger'>{errors['categoria']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="descripcion">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={articuloManufacturado.descripcion}
                                onChange={handleInputChange}
                            />
                            {errors['descripcion'] && <div className='ms-1 mt-1 text-danger'>{errors['descripcion']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="tiempoEstimadoMinutos">
                            <Form.Label>Tiempo Estimado (Minutos)</Form.Label>
                            <Form.Control
                                type="number"
                                value={articuloManufacturado.tiempoEstimadoMinutos}
                                min={0}
                                step={0.1}
                                onChange={handleInputChange}
                            />
                            {errors['tiempoEstimadoMinutos'] && <div className='ms-1 mt-1 text-danger'>{errors['tiempoEstimadoMinutos']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="precioVenta">
                            <Form.Label>Precio de Venta</Form.Label>
                            <Form.Control
                                type="number"
                                value={articuloManufacturado.precioVenta}
                                min={0}
                                step={0.01}
                                onChange={handleInputChange}
                            />
                            {errors['precioVenta'] && <div className='ms-1 mt-1 text-danger'>{errors['precioVenta']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="unidadMedida">
                            <Form.Label>Unidad de Medida</Form.Label>
                            <div className="d-flex">
                            <Form.Control
                                as="select"
                                value={articuloManufacturado.unidadMedida.id}
                                onChange={handleInputChange}
                            >
                                <option key={0} value='0' disabled>Seleccione una opción</option>
                                {unidadesMedida.map((unidad: UnidadMedida) => (
                                    <option key={unidad.id} value={unidad.id}>{unidad.denominacion}</option>
                                ))}
                            </Form.Control>
                            <BtnAddCategory openModal={() => setShowUnidadesMedida(true)}/>
                            </div>
                            {errors['unidadMedida'] && <div className='ms-1 mt-1 text-danger'>{errors['unidadMedida']}</div>}
                        </Form.Group>

                        </div>
                        <div className='col-lg d-flex flex-column justify-content-between'>

                        <Form.Group className="mb-3" controlId="preparacion">
                            <Form.Label>Preparación</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={articuloManufacturado.preparacion}
                                onChange={handleInputChange}
                            />
                        {errors['preparacion'] && <div className='ms-1 mt-1 text-danger'>{errors['preparacion']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="articuloManufacturadoDetalles">
                            <Form.Label>Cargar Receta</Form.Label>
                            <CargarDetalles articulo={articuloManufacturado} handleChange={(key, value) => setArticuloManufacturado(prevState => ({
                                ...prevState,
                                [key]: value
                            }))} />
                        {errors['articuloManufacturadoDetalles'] && <div className='ms-1 mt-1 text-danger'>{errors['articuloManufacturadoDetalles']}</div>}
                        </Form.Group>
                        </div>

                        <Form.Group className="mb-3" controlId="imagenes">
                            <Form.Label>Imágenes</Form.Label>
                            <CargarImagenes imagenes={articuloManufacturado.imagenes} handleChange={(key, value) => setArticuloManufacturado(prevState => ({
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

            <Modal show={showCategorias} onHide={() => setShowCategorias(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Categorías</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CategoriasForm />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowCategorias(false)}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showUnidadesMedida} onHide={() => setShowUnidadesMedida(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Unidades de Medida</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UnidadesMedidaForm />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowUnidadesMedida(false)}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>

            <div>
                <div className='d-flex justify-content-between'>
                    <SearchBar setBusqueda={setBusqueda} handleBusqueda={handleBusqueda} />

                    <div className="col mb-3 mt-auto d-flex justify-content-end">
                        <CboBoxFiltrar
                            idCboInput="Categoria"
                            titulo="Categoría"
                            datos={categoriasFiltradas}
                            handleChange={handleChangeCategoria}
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
                            <TableCell align="right">Precio de Venta</TableCell>
                            <TableCell align="right">Tiempo Estimado (min)</TableCell>
                            <TableCell align="right">Categoría</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {manufacturados.map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default ArticulosManufacturados;