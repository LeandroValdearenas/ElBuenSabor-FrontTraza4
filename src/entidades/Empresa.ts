import Base from "./Base";
import Imagen from "./Imagen";
import Sucursal from "./Sucursal";

export default class Empresa extends Base {
    nombre:string = '';
    razonSocial:string = '';
    cuil:number = 0;
    imagen:Imagen = new Imagen();
    sucursales:Sucursal[] = [];
    domain:string = '';
}