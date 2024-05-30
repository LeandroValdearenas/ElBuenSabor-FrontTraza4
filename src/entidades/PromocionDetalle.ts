import ArticuloInsumo from "./ArticuloInsumo";
import ArticuloManufacturado from "./ArticuloManufacturado";
import Base from "./Base";

export default class PromocionDetalle extends Base {
    cantidad:number = 0;
    articulo:ArticuloInsumo|ArticuloManufacturado = new ArticuloManufacturado();
}