import { useContext } from "react"
import { AtributosContext } from "../context/AtributosContext"

export const useAtributos = () => {
    const context = useContext(AtributosContext);

    if (context === undefined) {
        throw new Error("useCart debe ser usado dentre del ámbito de un CartContextProvider");
    }

    return context;
}