import Base from "./Base";
import Provincia from "./Provincia";

export default class Localidad extends Base {
    nombre:string = '';
    provincia:Provincia = new Provincia();
}