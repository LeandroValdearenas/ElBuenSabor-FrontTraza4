import ArticuloInsumo from "../entidades/ArticuloInsumo";
import BackendClient from "./BackendClient";

export default class ArticuloInsumoService extends BackendClient<ArticuloInsumo> {
    async buscarXDenominacion(busqueda:string): Promise<ArticuloInsumo[]> {
        const response = await fetch(`${this.baseUrl}/busqueda/${busqueda}`);
        const data = await response.json();
        return data as ArticuloInsumo[];
    }
}
