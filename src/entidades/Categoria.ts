import Base from "./Base";
import Sucursal from "./Sucursal";

export default class Categoria extends Base {
    denominacion:string = "";
    subCategorias:Categoria[] = [];
    sucursales?:Sucursal[] = [];
}