import Categoria from "./Categoria";
import Imagen from "./Imagen";
import ArticuloManufacturadoDetalle  from "./ArticuloManufacturadoDetalle";
import UnidadMedida from "./UnidadMedida";
import Base from "./Base";
import StockManufacturado from "./StockManufacturado";

export default class ArticuloManufacturado extends Base {
    denominacion:string = "";
    categoria:Categoria = new Categoria();
    descripcion:string = "";
    precioVenta:number = 0;
    tiempoEstimadoMinutos:number = 0;
    unidadMedida:UnidadMedida = new UnidadMedida();
    imagenes:Imagen[] = [];
    articuloManufacturadoDetalles:ArticuloManufacturadoDetalle[] = [];
    preparacion:string = "";
    stockActual:number = 0;
    precioCosto:number = 0;
    stocksManufacturado:StockManufacturado[] = [];
    type:string = "manufacturado";
}