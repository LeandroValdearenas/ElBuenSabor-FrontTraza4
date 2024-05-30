import Base from "./Base";
import Sucursal from "./Sucursal";

export default class StockInsumo extends Base {
    stockActual:number = 0;
    stockMinimo:number = 0;
    stockMaximo:number = 0;
    sucursal:Sucursal = new Sucursal();
}