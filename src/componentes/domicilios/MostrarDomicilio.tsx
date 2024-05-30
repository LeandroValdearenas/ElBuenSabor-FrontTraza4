import '../../slick-theme.css';
import Domicilio from '../../entidades/Domicilio';
import BtnEdit from '../btnEdit/BtnEdit';
import BtnDelete from '../btnDelete/BtnDelete';

type DomiciliosArgs = {
    domicilioPrevio: Domicilio,
    editar?: boolean,
    handleOpenModal: (value: Domicilio) => void,
    handleDelete: (id: number) => void,
}

function MostrarDomicilio({domicilioPrevio, editar = false, handleOpenModal, handleDelete}:DomiciliosArgs) {
    return (
    <div className="mb-3 row">

        <div className="card">
        <div className="card-body row">
            <div className="col">
                <h5 className="card-title">Domicilio</h5>
                <h6 className="card-subtitle mb-2 text-muted">{domicilioPrevio.calle} {domicilioPrevio.numero}</h6>
                <p className="card-text">Código postal: {domicilioPrevio.cp}, Localidad: {domicilioPrevio.localidad.nombre}</p>
            </div>
            {editar && 
            <div className="col-2">
                <div className="d-flex flex-column justify-content-end">
                    <BtnEdit handleClick={() => handleOpenModal(domicilioPrevio)} />
                    <BtnDelete handleClick={() => handleDelete(domicilioPrevio.id)} />
                </div>
            </div>
            }
        </div>
        </div>
    </div>
    );
}

export default MostrarDomicilio;