import { useCallback, useEffect, useState } from "react";
import Empresa from "../../entidades/Empresa";
import { useAtributos } from "../../hooks/useAtributos";
import EmpresaService from "../../servicios/EmpresaService";
import { Button, Form, Modal } from "react-bootstrap";
import BtnEdit from "../../componentes/btnEdit/BtnEdit";
import BtnDelete from "../../componentes/btnDelete/BtnDelete";
import CargarImagen from "../../componentes/cargarImagenes/CargarImagen";

export default function Empresas() {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [empresa, setEmpresa] = useState<Empresa>(new Empresa());
    const [showEmpresa, setShowEmpresa] = useState(false);
    const [errorsEmpresa, setErrorsEmpresa] = useState<{ [key in keyof Empresa]?: string }>({});
    const { setNombreApartado } = useAtributos();

    const urlapi = import.meta.env.VITE_API_URL;
    const empresasService = new EmpresaService(urlapi + "/empresas");

    const handleCloseEmpresa = () => {
        setShowEmpresa(false);
        setErrorsEmpresa({});
    }

    const handleShowEmpresa = (datos?: Empresa) => {
        const seleccionado = new Empresa();
        if (datos) {
            Object.assign(seleccionado, datos);
        }
        setEmpresa(seleccionado);
        setShowEmpresa(true);
    }

    const handleInputChangeEmpresa = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const id = e.target.id;
        errorsEmpresa[id] = '';
        let value: any;
        if (e.target.type === 'text') {
            value = String(e.target.value);
        } else if (e.target.type === 'number') {
            value = Number(e.target.value);
        } else {
            value = { id: Number(e.target.value) };
        }
        setEmpresa(prevState => ({
            ...prevState,
            [id]: value
        }));
    }

    const getEmpresasRest = async () => {
        let empresas: Empresa[] = await empresasService.getAll();
        empresas.forEach(empresa => empresa.sucursales.forEach(sucursal => sucursal.empresa = { id: empresa.id } as Empresa));
        setEmpresas(empresas);
    }

    const deleteEmpresa = async (idEmpresa: number) => {
        try {
            await empresasService.delete(idEmpresa);
            getEmpresasRest();
        } catch {
            alert("No se puede eliminar esta empresa. Asegúrese de que no se esté usando en otros datos.");
        }
    }

    const handleSaveEmpresa = useCallback(async () => {
        // Validación
        const erroresNuevos : {[key in keyof Empresa]?: string} = {}
        for (const key in Empresa) {
            if (Empresa.hasOwnProperty(key)) {
                erroresNuevos[key] = '';
            }
        }

        // Atributos de Empleado
        if (empresa.nombre === '') {
            erroresNuevos['nombre'] = 'Debe ingresar el nombre de la empresa';
        }
        if (empresa.domain === '') {
            erroresNuevos['domain'] = 'Debe ingresar el dominio de una empresa';
        }
        if (empresa.razonSocial === '') {
            erroresNuevos['razonSocial'] = 'Debe ingresar la razón social de la empresa';
        }
        if (empresa.cuil < 0) {
            erroresNuevos['cuil'] = 'Debe ingresar un cuil válido, que sea mayor o igual a cero';
        } else if (empresa.cuil.toString().length !== 8)  {
            erroresNuevos['cuil'] = 'El cuil de la empresa debe tener 8 cifras.';
        }

        setErrorsEmpresa(erroresNuevos);
        if (Object.keys(erroresNuevos).some(key => (erroresNuevos as any)[key].length > 0)) {
            return
        }
        if (empresa.id === 0) {
            await empresasService.post(empresa);
        } else {
            await empresasService.put(empresa.id, empresa);
        }
        getEmpresasRest();
        handleCloseEmpresa();
    }, [empresasService, empresa, getEmpresasRest]);

    useEffect(() => {
        setNombreApartado('Empresas');
        getEmpresasRest();
    }, []);

    return (

        <div className="m-3">
            <Modal show={showEmpresa} onHide={handleCloseEmpresa}>
                <Modal.Header closeButton>
                    <Modal.Title>Empresa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>

                    <Form.Group className="mb-3" controlId="imagen">
                            <Form.Label>Imágen</Form.Label>
                            <CargarImagen imagen={empresa.imagen} handleChange={(key, value) => setEmpresa(prevState => ({
                                ...prevState,
                                [key]: value
                            }))} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="nombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={empresa.nombre}
                                autoFocus
                                onChange={handleInputChangeEmpresa}
                                required
                            />
                        {errorsEmpresa['nombre'] && <div className='ms-1 mt-1 text-danger'>{errorsEmpresa['nombre']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="razonSocial">
                            <Form.Label>Razón Social</Form.Label>
                            <Form.Control
                                type="text"
                                value={empresa.razonSocial}
                                onChange={handleInputChangeEmpresa}
                                required
                            />
                        {errorsEmpresa['razonSocial'] && <div className='ms-1 mt-1 text-danger'>{errorsEmpresa['razonSocial']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="cuil">
                            <Form.Label>CUIL</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                step={1}
                                value={empresa.cuil}
                                onChange={handleInputChangeEmpresa}
                                required
                            />
                        {errorsEmpresa['cuil'] && <div className='ms-1 mt-1 text-danger'>{errorsEmpresa['cuil']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="domain">
                            <Form.Label>Dominio</Form.Label>
                            <Form.Control
                                type="text"
                                value={empresa.domain}
                                onChange={handleInputChangeEmpresa}
                                required
                            />
                        {errorsEmpresa['domain'] && <div className='ms-1 mt-1 text-danger'>{errorsEmpresa['domain']}</div>}
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEmpresa}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleSaveEmpresa}>
                        Enviar
                    </Button>
                </Modal.Footer>
            </Modal>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '18px' }}>

                <div className="mx-2 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2 justify-content-start">
                    {empresas.map((empresa: Empresa) => (
                        <div key={empresa.id} className="card border-0 mx-2" style={{ width: "242px", height: "250px" }}>
                            <img src={empresa.imagen.url} className="card-img-top" style={{ height: '165px' }} alt="..." />
                            <div className="card-body m-0 p-0">
                                <div className="d-flex">
                                    <div className="col">
                                        <h5 className="card-title mb-0">{empresa.nombre}</h5>
                                        <h6 className="card-text my-0">{empresa.domain}</h6>
                                        <p className="card-text" style={{ fontSize: '0.8rem' }}>{empresa.razonSocial} </p>
                                    </div>
                                    <div className="col-4 mt-1 d-flex justify-content-between">
                                        <BtnEdit handleClick={() => handleShowEmpresa(empresa)} />
                                        <BtnDelete handleClick={() => deleteEmpresa(empresa.id)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="card border-0 mx-2" style={{ width: "242px", height: "250px" }}>
                
                <button className="rounded" onClick={() => { handleShowEmpresa() }} style={{
                    width: '242px',
                    height: '250px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor:'#E0E0E0'
                    }} > <div style={{width: '121px',
                    height: '120px'}}>
                        <svg fill="#999999"className="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-6flbmm" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"></path></svg>
                        </div>  
                        </button>
                </div>

            </div>
        </div>

    )
}