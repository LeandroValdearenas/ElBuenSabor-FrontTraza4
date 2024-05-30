import { useEffect, useState } from "react";
import ArticuloInsumo from "../../entidades/ArticuloInsumo";
import ArticuloInsumoService from "../../servicios/ArticuloInsumoService";
import PromocionDetalle from '../../entidades/PromocionDetalle';
import { DataGrid, GridColDef, GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid';
import ArticuloManufacturadoService from "../../servicios/ArticuloManufacturadoService";
import ArticuloManufacturado from "../../entidades/ArticuloManufacturado";

function PromocionArticuloForm({ detallesPrevios, onDetallesChange, handleCloseModal }: { detallesPrevios:PromocionDetalle[], onDetallesChange: (nuevosDetalles: PromocionDetalle[]) => void , handleCloseModal:() => void}) {
    const [articulos, setArticulos] = useState<(ArticuloInsumo|ArticuloManufacturado)[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [rows, setRows] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const apiRef = useGridApiRef();

    const urlapi = import.meta.env.VITE_API_URL;
    const articuloInsumoService = new ArticuloInsumoService(urlapi + "/insumos");
    const articuloManufacturadoService = new ArticuloManufacturadoService(urlapi + "/manufacturados");
    
    const getInsumosRest = async () => {
      const datosInsumo:ArticuloInsumo[] = (busqueda? await articuloInsumoService.buscarXDenominacion(busqueda) : await articuloInsumoService.getAll()).filter(articulo => !detallesPrevios.some(detalle => detalle.articulo.id === articulo.id));
      const datosManufacturado:ArticuloManufacturado[] = (busqueda? await articuloManufacturadoService.buscarXDenominacion(busqueda) : await articuloManufacturadoService.getAll()).filter(articulo => !detallesPrevios.some(detalle => detalle.articulo.id === articulo.id));
      const datos = [...datosInsumo.filter(insumo => !insumo.esParaElaborar), ...datosManufacturado]
      setArticulos(datos);
    }

    const handleSelectionChange = (selectionModel: GridRowSelectionModel) => {
      if (selectionModel.length > selectedRows.length)
      {
        const rowId = selectionModel[selectionModel.length - 1];
        if (apiRef.current) {
          apiRef.current.setCellFocus(rowId, 'cantidad');
        }
      }
      setSelectedRows(selectionModel);
    };

    const handleButtonClick = () => {
      const nuevosDetalles:PromocionDetalle[] = [];
      rows.forEach((articulo) => {
          const detalle: PromocionDetalle = new PromocionDetalle();
          articulo.type = articulo.manufacturadoDetalles ? 'manufacturado' : 'insumo';
          detalle.articulo = articulo;
          detalle.cantidad = rows.find(fila => fila.id === articulo.id).cantidad || 1;
          nuevosDetalles.push(detalle);
      });
      onDetallesChange(nuevosDetalles);
      handleCloseModal();
    };

    const handleBusqueda = () => {
      const nuevasSelecciones = rows.filter(row => selectedRows.includes(row.id));
      if (nuevasSelecciones.length) {
        detallesPrevios.push(... nuevasSelecciones.map(seleccion => {return {cantidad:0, id:0, articulo:{...seleccion}}}));
        setSelectedRows([]);
      }
      getInsumosRest();
    };

    const handleProcessRowUpdate = (newRow: any, oldRow: any) => {
      if (isNaN(Number(newRow.cantidad))) {
        alert("La cantidad tiene que ser un valor numérico.");
        return oldRow;
      }

      newRow.cantidad = Number(newRow.cantidad);

      if (newRow.cantidad <= 0) {
        alert("No se puede ingresar una cantidad menor a 0.");
        return oldRow;
      }
      if (newRow.cantidad >= 1000000) {
        alert("La cantidad es demasiado grande. Limítese a 6 cifras");
        return oldRow;
      }
      const updatedRows = rows.map(row => row.id === newRow.id ? newRow : row);
      setRows(updatedRows);
      return newRow;
    };

    useEffect(() => { 
      getInsumosRest();
    }, []);

    useEffect(() => { 
      setRows([ ...articulos.filter(row => selectedRows.includes(row.id)),...detallesPrevios.map(detalle => {return {...detalle.articulo, cantidad:detalle.cantidad}})]);
    }, [selectedRows]);

    const columns: GridColDef<(typeof rows)[number]>[] = [
      {
        field: 'denominacion',
        headerName: 'Nombre',
        width: 500,
      },
      {
        field: 'cantidad',
        headerName: 'Cantidad',
        width: 110,
        editable: true,
      },
      {
        field: 'precioVenta',
        headerName: 'Precio de Venta',
        width: 150,
        valueGetter: (_value: any, row: { precioVenta: number }) => `${row.precioVenta.toLocaleString('es-AR') || ''}`,
      },
    ] as GridColDef<(typeof rows)[number]>[];

    const columnsViewonly: GridColDef<(typeof rows)[number]>[] = [
      {
        field: 'denominacion',
        headerName: 'Nombre',
        width: 500,
      },
      {
        field: 'precioVenta',
        headerName: 'Precio de Venta',
        width: 150,
        valueGetter: (_value: any, row: { precioVenta: number }) => `${row.precioVenta.toLocaleString('es-AR') || ''}`,
      },
    ] as GridColDef<(typeof rows)[number]>[];

    return (
      <div>
        <div className="mb-3">
          <br/>
          <h5 className='d-flex'>Agregar artículos</h5>
          <div className='d-flex justify-content-between'>
            <div className='col-6'>
              <div className="search">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="fa fa-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
                <input type="text" className="form-control" placeholder="Buscar por denominación" onChange={e => setBusqueda(String(e.target.value))}/>
                <button className="btn btn-primary" onClick={handleBusqueda}>Buscar</button>
              </div>
            </div>
          </div>
          { articulos.length 
            ? <DataGrid
              rows={articulos}
              columns={columnsViewonly}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              onRowSelectionModelChange={handleSelectionChange}
              rowSelectionModel={selectedRows}
              />
          : <p className="mt-4 d-flex">
              No se encontraron artículos actualmente!
            </p>
        }
        </div>
        <h5 className='d-flex mt-2'>Modificar insumos actuales</h5>
          <DataGrid
              apiRef={apiRef}
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
              processRowUpdate={handleProcessRowUpdate}
              />
          <p className="mt-4 d-flex">
            Seleccione artículos para agregarlos
          </p>
        <div className="d-flex justify-content-end">
          <button className="btn btn-success" onClick={handleButtonClick}>Guardar</button>
        </div>
      </div>
      )
}

export default PromocionArticuloForm;