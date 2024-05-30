import { Rol } from "../enums/Rol";
import Base from "./Base";
import Domicilio from "./Domicilio";
import Imagen from "./Imagen";

export default class Cliente extends Base {
    rol:Rol = Rol.Cliente;
    nombre:string = "" ;
    apellido:string = "" ;
    telefono:string = "" ;
    email:string = "" ;
    fechaNacimiento:Date = new Date();
    imagen:Imagen = new Imagen();
    domicilios:Domicilio[] = [];
    pedidos:[] = [];
}