import { useEffect, useState } from "react";
import '../../slick-theme.css';
import Domicilio from '../../entidades/Domicilio';
import Localidad from "../../entidades/Localidad";
import Provincia from "../../entidades/Provincia";
import Pais from "../../entidades/Pais";
import LocalidadService from "../../servicios/LocalidadService";
import ProvinciaService from "../../servicios/ProvinciaService";
import PaisService from "../../servicios/PaisService";
import { Autocomplete, TextField } from "@mui/material";

type DomiciliosArgs = {
    domicilio: Domicilio,
    errors?: { [key in keyof Domicilio]?: string },
    handleChangeDomicilio: (key: keyof object, value: any) => void
}

function DomicilioForm({domicilio, errors={}, handleChangeDomicilio}:DomiciliosArgs) {
    const [paises, setPaises] = useState<{id:number, label:string}[]>([]);
    const [provincias, setProvincias] = useState<{id:number, label:string}[]>([]);
    const [localidades, setLocalidades] = useState<{id:number, label:string}[]>([]);
    const [selectedPais, setSelectedPais] = useState<Pais>(new Pais());
    const [selectedProvincia, setSelectedProvincia] = useState<Provincia>(new Provincia());
    const [selectedLocalidad, setSelectedLocalidad] = useState<Localidad>(new Localidad());

    const urlapi = import.meta.env.VITE_API_URL;
    const localidadService = new LocalidadService(urlapi + "/localidades");
    const provinciaService = new ProvinciaService(urlapi + "/provincias");
    const paisService = new PaisService(urlapi + "/paises");

    const getLocalidadesRest = async (idProvincia?:number) => {
        const localidades = await localidadService.getAll();
        const localidadesFiltradas = idProvincia? localidades.filter(l => l.provincia.id === idProvincia): localidades;
        const localidadesOpciones = [{id:0, label:'Seleccione una localidad'},...localidadesFiltradas.map(l => {return {id:l.id, label:l.nombre}})]
        setLocalidades(localidadesOpciones);
    }

    const getProvinciasRest = async (idPais?:number) => {
        const provincias = await provinciaService.getAll();
        const provinciasFiltradas = idPais? provincias.filter(p => p.pais.id === idPais): provincias;
        const provinciasOpciones = [{id:0, label:'Seleccione una provincia'},...provinciasFiltradas.map(p => {return {id:p.id, label:p.nombre}})]
        setProvincias(provinciasOpciones);
    }

    const getPaisesRest = async () => {
        const paises = [{id:0, label:'Seleccione un país'},...((await paisService.getAll()).map(p => {return {id:p.id, label:p.nombre}}))];
        setPaises(paises);
    }

    const handleChangePais = (value: any) => {
        errors['pais'] = '';
        setSelectedPais({id:value.id, nombre:value.label});
        setSelectedProvincia(new Provincia());
        setSelectedLocalidad(new Localidad());
    }

    const handleChangeProvincia = (value: any) => {
        const provincia = { id:value.id, nombre:value.label, pais:selectedPais };
        errors['provincia'] = '';
        setSelectedProvincia(provincia);
        setSelectedLocalidad(new Localidad());
    }

    const handleChangeLocalidad = (value: any) => {
        const localidad = { id:value.id, nombre:value.label, provincia:selectedProvincia };
        errors['localidad'] = '';
        setSelectedLocalidad(localidad);
    }

    const handleSubmitLocalidad = () => {
        const newData = { ...domicilio, localidad: selectedLocalidad };
        handleChangeDomicilio('domicilio' as keyof object, newData);
    }

    const handleChange = (key: string, value: any) => {
        let finalValue: any;
        errors[key] = '';
        if (typeof domicilio[key] === 'number') {
            finalValue = Number(value);
        } else {
            finalValue = value;
        }
  
        const newData = { ...domicilio, [key]: finalValue };

        handleChangeDomicilio('domicilio' as keyof object, newData);
      };

    useEffect(() => {
        getPaisesRest();
        if (domicilio.localidad) {
            setSelectedPais(domicilio.localidad.provincia.pais);
            setSelectedProvincia(domicilio.localidad.provincia);
            setSelectedLocalidad(domicilio.localidad);
        }
    }, [domicilio.id]);

    useEffect(() => {
        if (selectedPais.id !== 0)
            getProvinciasRest(selectedPais.id);
    }, [selectedPais]);

    useEffect(() => {
        if (selectedProvincia.id !== 0)
            getLocalidadesRest(selectedProvincia.id);
    }, [selectedProvincia]);

    useEffect(() => {
        handleSubmitLocalidad();
    }, [selectedLocalidad]);
    
    return (
    <div className="d-flex flex-column h-100 mb-3 p-3 border rounded justify-content-between" >
        <div className="mb-3 row">
            <div className="col-9">
                <label htmlFor="calle" className="form-label">Calle</label>
                <input
                    type='text'
                    id='calle'
                    className='form-control'
                    value={domicilio.calle}
                    onChange={(e) => handleChange('calle', e.target.value)}
                    required
                    />
            {errors['calle'] && <div className='ms-1 mt-1 text-danger'>{errors['calle']}</div>}
            </div>
            <div className="col-3">
                <label htmlFor="numero" className="form-label">Número</label>
                <input
                    type='number'
                    min={0}
                    id='numero'
                    className='form-control'
                    value={domicilio.numero}
                    onChange={(e) => handleChange('numero', e.target.value)}
                    required
                    />
            {errors['numero'] && <div className='ms-1 mt-1 text-danger'>{errors['numero']}</div>}
            </div>
        </div>
        <div className="mb-3 row">
            <div className="col">
            <Autocomplete
                disablePortal
                id="pais"
                options={paises}
                getOptionDisabled={(option) =>
                    option === paises[0]
                }
                isOptionEqualToValue={(option, value) => value.id === 0 || option.id === value.id}
                value={{id:selectedPais.id, label:selectedPais.nombre}}
                renderInput={(params) => <TextField autoComplete="off" {...params} label="País" />}
                onChange={(_e, value) => {handleChangePais(value)}}
            />
            {errors['pais'] && <div className='ms-1 mt-1 text-danger'>{errors['pais']}</div>}
            </div>
            <div className="col">
            <Autocomplete
                disablePortal
                disabled={provincias.length === 0 || selectedPais.id === 0}
                id="provincia"
                options={provincias}
                getOptionDisabled={(option) =>
                    option === provincias[0]
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={{id:selectedProvincia.id, label:selectedProvincia.nombre}}
                renderInput={(params) => <TextField {...params} label="Provincia" />}
                onChange={(_e, value) => {handleChangeProvincia(value)}}
            />
            {errors['provincia'] && <div className='ms-1 mt-1 text-danger'>{errors['provincia']}</div>}
            </div>
        </div>
        <div className="mb-3 row align-items-end">
            <div className="col">
            <Autocomplete
                disablePortal
                disabled={localidades.length === 0 || selectedProvincia.id === 0}
                id="localidad"
                options={localidades}
                getOptionDisabled={(option) =>
                    option === localidades[0]
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={{id:selectedLocalidad.id, label:selectedLocalidad.nombre}}
                renderInput={(params) => <TextField {...params} label="Localidad" />}
                onChange={(_e, value) => handleChangeLocalidad(value)}
            />
            {errors['localidad'] && <div className='ms-1 mt-1 text-danger'>{errors['localidad']}</div>}
            </div>
            <div className="col-3">
                <label htmlFor="cp" className="form-label">Código postal</label>
                <input
                    type='number'
                    min={0}
                    id='cp'
                    className='form-control'
                    value={domicilio.cp}
                    onChange={(e) => handleChange('cp', e.target.value)}
                    required
                    />
            {errors['cp'] && <div className='ms-1 mt-1 text-danger'>{errors['cp']}</div>}
            </div>
        </div>
    </div>
    );
}

export default DomicilioForm;