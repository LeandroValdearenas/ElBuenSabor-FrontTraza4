import ArticuloInsumo from "./ArticuloInsumo";
import Base from "./Base";

export default class ArticuloManufacturadoDetalle extends Base {
    cantidad:number = 0;
    articuloInsumo:ArticuloInsumo = new ArticuloInsumo();
}