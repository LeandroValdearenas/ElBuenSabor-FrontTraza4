import Base from "./Base";
import Categoria from "./Categoria";
import Imagen from "./Imagen";
import StockInsumo from "./StockInsumo";
import UnidadMedida from "./UnidadMedida";

export default class ArticuloInsumo extends Base {
    denominacion:string = "";
    categoria:Categoria = new Categoria();
    stockActual?:number = 0;
    stockMinimo?:number = 0;
    stockMaximo?:number = 0;
    precioCompra:number = 0;
    precioVenta:number = 0;
    unidadMedida:UnidadMedida = new UnidadMedida();
    imagenes:Imagen[] = [];
    esParaElaborar:boolean = true;
    type:string = "insumo";
    stocksInsumo?:StockInsumo[] = [];
}