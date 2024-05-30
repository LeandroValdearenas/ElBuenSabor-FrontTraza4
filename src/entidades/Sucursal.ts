import Base from "./Base";
import Domicilio from "./Domicilio";
import Empresa from "./Empresa";
import Imagen from "./Imagen";

export default class Sucursal extends Base {
    nombre:string = '';
    horarioApertura:Date = new Date();
    horarioCierre:Date = new Date();
    domicilio:Domicilio = new Domicilio();
    casaMatriz:boolean = false;
    imagen:Imagen = new Imagen();
    empresa?:Empresa = new Empresa();
}