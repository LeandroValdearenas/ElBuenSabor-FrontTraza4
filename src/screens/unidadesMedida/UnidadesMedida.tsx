import { useEffect } from "react";
import { useAtributos } from "../../hooks/useAtributos";
import UnidadesMedidaForm from "./UnidadesMedidaForm";

function UnidadesMedida() {
    const {setNombreApartado} = useAtributos();

    useEffect(() => {
        setNombreApartado('Unidades de Medida');
    }, []);

    return (
        <div className="m-3">
            <UnidadesMedidaForm />
        </div>
    );
}

export default UnidadesMedida;