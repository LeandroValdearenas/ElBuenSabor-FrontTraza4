import Pedido from "../entidades/Pedido";
import BackendClient from "./BackendClient";

export default class PedidoService extends BackendClient<Pedido> {
    async buscarXNombreIdFecha(busqueda:string): Promise<Pedido[]> {
        const response = await fetch(`${this.baseUrl}/busqueda/${busqueda}`);
        const data = await response.json();
        return data as Pedido[];
    }
}
