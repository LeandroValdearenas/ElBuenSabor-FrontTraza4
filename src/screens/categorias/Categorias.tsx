import { useEffect } from "react";
import { useAtributos } from "../../hooks/useAtributos";
import CategoriasForm from "./CategoriasForm";

function Categorias() {
    const {setNombreApartado} = useAtributos();

    useEffect(() => {
        setNombreApartado('Categorías');
    }, []);

    return (
        <div className="m-3">
            <CategoriasForm />
        </div>
    );
}

export default Categorias;