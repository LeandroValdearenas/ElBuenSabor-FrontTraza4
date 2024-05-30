import ArticuloInsumo from "./ArticuloInsumo";
import ArticuloManufacturado from "./ArticuloManufacturado";
import Base from "./Base";

export default class DetallePedido extends Base {
    cantidad:number = 0;
    subTotal:number = 0;
    articulo:(ArticuloInsumo|ArticuloManufacturado) = new ArticuloManufacturado();
}