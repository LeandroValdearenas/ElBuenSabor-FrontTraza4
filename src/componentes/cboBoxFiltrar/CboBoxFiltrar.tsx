type CboBoxFiltrarArgs = {
    idCboInput: string,
    datos: {id:number, denominacion:string}[],
    handleChange: (e:React.ChangeEvent<HTMLSelectElement>) => void,
    titulo?: string,
}

function CboBoxFiltrar ({idCboInput, datos, handleChange, titulo=idCboInput}:CboBoxFiltrarArgs) {
    return (
            <div className="d-flex">
              <label htmlFor={"cbo" + idCboInput} className="me-3 my-auto">{titulo}</label>
              <select id={"cbo" + idCboInput} className='form-select' onChange={e => handleChange(e)}>
                <option value={0}> {"Filtrar por " + titulo} </option>
                {datos.map(dato =>
                    <option key={dato.id} value={dato.id}>{dato.denominacion}</option>
                )}
              </select>
            </div>
    );
}

export default CboBoxFiltrar;