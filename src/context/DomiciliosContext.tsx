import { Dispatch, ReactNode, createContext, useRef, useState } from "react";
import Domicilio from "../entidades/Domicilio";
import ModalGenerico from "../componentes/modalGenerico/ModalGenerico";
import Domicilios from "../componentes/domicilios/Domicilios";

interface DomiciliosContextType {
    domicilios: Domicilio[],
    modalDomicilios: any,
    openModalDomicilios: (domicilios: Domicilio[]) => void,
    setDomicilios: Dispatch<React.SetStateAction<Domicilio[]>>
}

export const DomiciliosContext = createContext<DomiciliosContextType>({
    domicilios: [],
    modalDomicilios: <></>,
    openModalDomicilios: () => { },
    setDomicilios: () => { }
});

export function DomiciliosContextProvider({ children }: { children: ReactNode }) {

    const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
    const modalRefDomicilios = useRef<any>(null);

    const openModalDomicilios = (domicilios: Domicilio[]) => {
        setDomicilios(domicilios.sort((a, b) => a.id - b.id));
        if (modalRefDomicilios.current) {
            modalRefDomicilios.current.openModal();
        }
    }

    const modalDomicilios =
        <ModalGenerico titulo="domicilios" tituloModal="Domicilios" ref={modalRefDomicilios}>
            <Domicilios domicilios={domicilios} handleChange={() => { }} />
        </ModalGenerico>

    return (
        <DomiciliosContext.Provider value={{
            domicilios,
            modalDomicilios,
            openModalDomicilios,
            setDomicilios
        }}>
            {children}
            {modalDomicilios}
        </DomiciliosContext.Provider>
    );
}