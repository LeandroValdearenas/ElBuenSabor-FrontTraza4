import ArticuloManufacturado from "../entidades/ArticuloManufacturado";
import BackendClient from "./BackendClient";

export default class ArticuloManufacturadoService extends BackendClient<ArticuloManufacturado> {
    async buscarXSucursal(sucursalId: number): Promise<ArticuloManufacturado[]> {
        const response = await fetch(`${this.baseUrl}/sucursal/${sucursalId}`);
        const data = await response.json();
        return data as ArticuloManufacturado[];
    }
    async buscarXDenominacion(busqueda:string): Promise<ArticuloManufacturado[]> {
        const response = await fetch(`${this.baseUrl}/busqueda/${busqueda}`);
        const data = await response.json();
        return data as ArticuloManufacturado[];
    }
}
