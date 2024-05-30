import { useContext } from "react"
import { DomiciliosContext } from "../context/DomiciliosContext";

export const useDomicilios = () => {
    const context = useContext(DomiciliosContext);

    if (context === undefined) {
        throw new Error("useDomicilios debe ser usado dentre del ámbito de un DomiciliosContextProvider");
    }

    return context;
}