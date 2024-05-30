import Base from "./Base";
import Cliente from "./Cliente";
import DetallePedido from "./DetallePedido";
import Domicilio from "./Domicilio";
import Empleado from "./Empleado";
import Sucursal from "./Sucursal";
export default class Pedido extends Base {
    horaEstimadaFinalizacion:Date = new Date();
    total: number = 0;
    totalCosto: number = 0;
    estado: string = '';
    tipoEnvio: string = '';
    formaPago: string = '';
    fechaPedido:Date = new Date();
    domicilio:Domicilio = new Domicilio();
    sucursal:Sucursal = new Sucursal();
    cliente:Cliente = new Cliente();
    empleado:Empleado = new Empleado();
    detallePedidos:DetallePedido[] = [];
}