import * as React from 'react';
import { useEffect, useState } from "react";
import Pedido from "../../entidades/Pedido";
import PedidoService from "../../servicios/PedidoService";
import { useAtributos } from "../../hooks/useAtributos";
import SearchBar from "../../componentes/searchBar/SearchBar";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, Form } from 'react-bootstrap';
import CboBoxFiltrar from '../../componentes/cboBoxFiltrar/CboBoxFiltrar';

const Facturacion = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const { setNombreApartado } = useAtributos();

    const urlapi = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService(urlapi + "/pedidos");

    const getPedidosRest = async (estado?:string) => {
        const datos: Pedido[] = busqueda ? await pedidoService.buscarXNombreIdFecha(busqueda) : await pedidoService.getAll();
        let pedidosFiltrados = datos//.filter(pedido => pedido.sucursal.id === Number(idsucursal));
        if (estado) {
            pedidosFiltrados = pedidosFiltrados.filter(pedido => pedido.estado === estado);
        }
        setPedidos(pedidosFiltrados);
    }

    const handleBusqueda = () => {
        getPedidosRest();
    }

    const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const estadoSeleccionado = e.target.selectedOptions[0].text;
        if (e.target.value === '0') {
            getPedidosRest();
        } else {
            getPedidosRest(estadoSeleccionado);
        }
    }

    const handleMostrarFactura = (datos: Pedido) => {
        console.log(datos);
    }

    useEffect(() => {
        getPedidosRest();
        setNombreApartado('Pedidos');
    }, []);

    function Row(props: { row: Pedido }) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);
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
              <TableCell align="center">{('0000' + row.id).slice(-5)}</TableCell>
              <TableCell align="center">{row.fechaPedido.toLocaleString('es-AR')}</TableCell>
              <TableCell align="center">{row.tipoEnvio}</TableCell>
              <TableCell align="center">{row.formaPago}</TableCell>
              <TableCell align="center">{row.estado}</TableCell>
              <TableCell align="center"><Button onClick={() => (handleMostrarFactura(row))}>Facturar</Button></TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Detalles del Pedido N°{('0000' + row.id).slice(-5)}
                    </Typography>
                    
                    <div className='row'>

                        <div className='col'>
                            <div><b>Fecha:</b> {row.fechaPedido.toLocaleString('es-AR')}</div>
                            <div><b>Nombre y apellido:</b> {row.cliente.nombre} {row.cliente.apellido}</div>
                            <div><b>Dirección:</b> {row.domicilio.calle} {row.domicilio.numero}</div>
                            <div><b>Forma de entrega:</b> {row.formaEntrega}</div>
                            <div><b>Forma de pago:</b> {row.formaPago}</div>
                        </div>

                        <div className='col'>
                            <div><b>Estado:</b> {row.estado}</div>
                            <div><b>Teléfono:</b> {row.cliente.telefono}</div>
                            <div><b>Localidad:</b> {row.domicilio.localidad.nombre}</div>
                            <div><b>Hora Estimada:</b> {String(row.horaEstimadaFinalizacion)}</div>
                        </div>

                    </div>
                          
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell>Producto</TableCell>
                          <TableCell>Cantidad</TableCell>
                          <TableCell>Precio unitario</TableCell>
                          <TableCell>Subtotal</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.detallePedidos.map((detalle) => (
                          <TableRow key={detalle.id}>
                            <TableCell component="th" scope="row">
                              {detalle.articulo.denominacion}
                            </TableCell>
                            <TableCell>{detalle.cantidad.toLocaleString('es-AR')}</TableCell>
                            <TableCell>${detalle.articulo.precioVenta.toLocaleString('es-AR')}</TableCell>
                            <TableCell>${(detalle.cantidad*detalle.articulo.precioVenta).toLocaleString('es-AR')}</TableCell>
                          </TableRow>
                        ))}
                        <div className='col-6 ms-auto'>
                        <TableRow key='subtotal'>
                            <TableCell>Subtotal</TableCell>
                            <TableCell>${row.total.toLocaleString('es-AR')}</TableCell>
                        </TableRow>
                        </div>
                        <TableRow key='descuentos'>
                            <TableCell component="th" scope="row" colSpan={2}></TableCell>
                            <TableCell>Descuentos</TableCell>
                            <TableCell>${row.total.toLocaleString('es-AR')}</TableCell>
                        </TableRow>
                        <TableRow key='total'>
                            <TableCell component="th" scope="row" colSpan={2}></TableCell>
                            <TableCell><b>Total</b></TableCell>
                            <TableCell><b>${row.total.toLocaleString('es-AR')}</b></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        );
      }


    return (
        <div className="m-3">
            <div>
                <div className='d-flex justify-content-between'>
                    <SearchBar setBusqueda={setBusqueda} handleBusqueda={handleBusqueda} />

                    <Form.Group className="mb-3 d-flex" controlId="rol">
                        <CboBoxFiltrar idCboInput='estado' titulo='Estado' datos={[{id:1, denominacion:"Preparación"}, {id:2, denominacion:"Pendiente"}, {id:3, denominacion:"Cancelado"}, {id:4, denominacion:"Rechazado"}, {id:5, denominacion:"Entregado"}]} handleChange={handleEstadoChange} />
                    </Form.Group>
                </div>
                
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align="center">Nro. de Pedido</TableCell>
                            <TableCell align="center">Fecha de Pedido</TableCell>
                            <TableCell align="center">Forma de Entrega</TableCell>
                            <TableCell align="center">Forma de Pago</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {pedidos.map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                
            </div>
        </div>
    )
}

export default Facturacion;