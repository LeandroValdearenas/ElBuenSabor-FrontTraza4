import Base from "./Base";
import Domicilio from "./Domicilio";
import Imagen from "./Imagen";
import Sucursal from "./Sucursal";

export default class Empleado extends Base {
    rol:string = "";
    domicilio:Domicilio = new Domicilio();
    nombre:string = "" ;
    apellido:string = "" ;
    telefono:string = "" ;
    email:string = "" ;
    fechaNacimiento:Date = new Date();
    imagen:Imagen = new Imagen();
    sucursal:Sucursal = new Sucursal();
}