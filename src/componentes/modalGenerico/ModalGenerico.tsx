import React, { forwardRef, useImperativeHandle, useState } from "react";

type ModalArgs = {
    tituloModal: string,
    titulo: string,
    children: React.ReactElement
}

const ModalGenerico = forwardRef(({ tituloModal, titulo, children }: ModalArgs, ref: React.Ref<any>) => {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    useImperativeHandle(ref, () => ({
        openModal,
        closeModal
    }));

    return (
        <>
            {showModal && (
                <div className="modal modal-xl fade show" style={{ display: "block" }} tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{children.props.data.id ? 'Modificar' : 'Crear'} {tituloModal}</h5>
                                <button type="button" id={"btn-close-" + titulo} className="btn-close" aria-label="Close" onClick={closeModal}></button>
                            </div>

                            <div className="modal-body container center">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && <div className="modal-backdrop fade show"></div>}
        </>
    );
});

export default ModalGenerico;