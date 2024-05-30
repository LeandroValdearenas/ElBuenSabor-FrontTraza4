import { useEffect, useState } from "react";
import Categoria from "../../entidades/Categoria";
import CategoriaService from "../../servicios/CategoriaService";
import { useAtributos } from "../../hooks/useAtributos";
import './Categorias.css';
import { useParams } from "react-router-dom";
import SucursalService from "../../servicios/SucursalService";
import Sucursal from "../../entidades/Sucursal";
import Toggle from "../../componentes/toggle/Toggle";

function CategoriasForm() {
    const {categorias, setCategorias} = useAtributos();
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [txtDenominacionNueva, setTxtDenominacionNueva] = useState<string>("");
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const {idsucursal} = useParams();

    const urlapi = import.meta.env.VITE_API_URL;
    const categoriaService = new CategoriaService(urlapi + "/categorias");
    const sucursalService = new SucursalService(urlapi + "/sucursales");

    const getCategoriasRest = async () => {
        let nuevasCategorias:Categoria[] = await categoriaService.getAll();
        setCategorias(nuevasCategorias);
    }

    const handleSucursalChange = async (categoria: Categoria) => {
        if (categoria.sucursales?.map(s => s.id).includes(Number(idsucursal)))
            categoria.sucursales = [...categoria.sucursales!.filter(s => s.id !== Number(idsucursal))];
        else
            categoria.sucursales = [...categoria.sucursales!, {id:Number(idsucursal)} as Sucursal];
        await categoriaService.put(categoria.id, categoria);
        getCategoriasRest();
    }

    const mostrarCategorias = (categoria:Categoria, padreId:number) => {
        const tieneHijos:boolean = categoria.subCategorias.length > 0;
        return (
            <div key={categoria.id} className="accordion-item">
                <h2 className="accordion-header d-flex flex-row" id={"flush-heading"+categoria.id}>
                {tieneHijos 
                    ? <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#flush-collapse"+categoria.id} aria-expanded="false" aria-controls={"flush-collapse"+categoria.id}> {categoria.denominacion} </button>
                    : <div className="accordion-button accordion-no-arrow collapsed"> {categoria.denominacion} </div>
                }

                <Toggle valor={categoria.sucursales!.map(s => s.id).includes(Number(idsucursal))} handleClick={() => handleSucursalChange(categoria)} />
                
                <button className="btn mx-2 p-0" type="button" onClick={() => mostrarInput(categoria.id)} >
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#333333" className="bi bi-plus-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg>
                    </div>
                </button>

                {!tieneHijos && 
                    <button className="btn mx-2 p-0" type="button" onClick={() => eliminarCategoria(categoria.id)} > <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FF0000" className="bi bi-plus-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                        </svg>
                    </div>
                </button>
                }

                </h2>
                
                <h2 className="accordion-header input-categoria" id={"inputCategoria"+categoria.id} hidden>
                    <div className="d-flex flex-row">

                    <div className="accordion-button accordion-no-arrow collapsed">
                        <input type="text" className="form-control" placeholder="Nombre de la categoría" value={txtDenominacionNueva} onChange={(e) => setTxtDenominacionNueva(String(e.target.value))}></input>
                    </div>

                    <button className="btn mx-2 p-0" type="button" onClick={() => save(categoria.id)}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#00AA00" className="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                            </svg>
                        </div>
                    </button>

                    </div>
                </h2>

                {tieneHijos && 
                    <div id={"flush-collapse"+categoria.id} className="accordion-collapse collapse" aria-labelledby={"flush-heading"+categoria.id} data-bs-parent={"#accordionFlush" + padreId}>
                        <div className="accordion-body">
                        {categoria.subCategorias.sort((a,b) => a.denominacion < b.denominacion ? -1 : 1).map(subcategoria => 
                            mostrarCategorias(subcategoria, categoria.id)
                        )}
                        </div>
                    </div>
                }

            </div>
        )
    }

    const mostrarInput = (categoriaPadreId?:number) => {
        const inputs = document.getElementsByClassName("input-categoria");
        for (let i = 0; i < inputs.length; i++) {
            const slide = inputs[i] as HTMLElement;
            slide.setAttribute("hidden", "true");
        }
        setTxtDenominacionNueva("");

        if (categoriaPadreId !== null)
            document.getElementById("inputCategoria" + categoriaPadreId)?.removeAttribute("hidden");
    }

    const save = async (categoriaPadreId:number | null) => {
        if (txtDenominacionNueva == undefined || txtDenominacionNueva == "") {
            setTxtValidacion("Ingrese el nombre de la categoría");
            return;
        }

        const categoriaNueva:Categoria = new Categoria();
        categoriaNueva.denominacion = txtDenominacionNueva;

        if (categoriaPadreId) {
            const categoriaPadre:Categoria = categorias.filter(categoria => categoria.id === categoriaPadreId)[0];
            categoriaPadre.subCategorias.push(categoriaNueva);
            await categoriaService.put(categoriaPadreId, categoriaPadre);
        }
        else {
            categoriaNueva.sucursales = sucursales;
            await categoriaService.post(categoriaNueva);
        }

        setTxtValidacion("");
        mostrarInput();

        await getCategoriasRest();
    }
    
    const eliminarCategoria = async (categoriaId:number) => {
        try {
            await categoriaService.delete(categoriaId);
          } catch {
            alert(`Hubo un conflicto. Asegúrese de que la categoría no esté siendo utilizada en otros datos.`);
          }

        await getCategoriasRest();
    }

    useEffect(() => {
        const fetchSucursales = async () => {
            const sucursales = await sucursalService.getAll();
            setSucursales(sucursales);
          };
        fetchSucursales();
        getCategoriasRest();
    }, []);

    return (
        <>
        <div className="row">
        <div className="col-sm">

            <div className="ms-3 mb-2 d-flex flex-row">
                <input type="text" className="form-control" placeholder="Nombre de la categoría" value={txtDenominacionNueva} onChange={(e) => setTxtDenominacionNueva(String(e.target.value))}></input>
                <button className="btn mx-2 p-0" type="button" onClick={() => save(null)}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#00AA00" className="bi bi-plus-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                        </svg>
                    </div>
                </button>
            </div>

            <div className="accordion accordion-flush" id="accordionFlush0">
                {categorias
                    .filter(
                        categoria => { return !categorias
                            .some( categoriaPadre => categoriaPadre.subCategorias
                                .some( subcategoria => subcategoria.id === categoria.id) 
                            ); 
                        }
                    )
                    .sort((a, b) => (a.denominacion < b.denominacion ? -1 : 1))
                    .map(categoria => mostrarCategorias(categoria, 0))
                }
            </div>

            <div>
                <label style={{ color: 'red', lineHeight: 5, padding: 5, userSelect: "none"}}>{txtValidacion}</label>
            </div>

        </div>
        </div>

        </>
    );
}

export default CategoriasForm;