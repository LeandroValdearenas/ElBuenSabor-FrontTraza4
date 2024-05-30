import Cliente from "../entidades/Cliente";
import BackendClient from "./BackendClient";

export default class ClienteService extends BackendClient<Cliente> {
    async buscarXNombre(busqueda:string): Promise<Cliente[]> {
        const response = await fetch(`${this.baseUrl}/busqueda/${busqueda}`);
        const data = await response.json();
        return data as Cliente[];
    }
}
