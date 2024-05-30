import Empleado from "../entidades/Empleado";
import BackendClient from "./BackendClient";

export default class EmpleadoService extends BackendClient<Empleado> {
    async buscarXNombre(busqueda:string): Promise<Empleado[]> {
        const response = await fetch(`${this.baseUrl}/busqueda/${busqueda}`);
        const data = await response.json();
        return data as Empleado[];
    }
}
