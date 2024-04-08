import React, { useEffect } from 'react';

export const ConfirmarModal = ({ DadoParaConfirmacao, AcaoConfirmacao, HandleFecharModal, ModalErro, MensagemModal }) => {

    useEffect(() => {
    }, []);


    return (
        <>
            <div className="modal-container">
                <div className='header-modal'>
                    <p>{ObterTituloModal()}</p>
                    <button className='botao-fechar-modal' onClick={HandleFecharModal}>X</button>
                </div>
                <div className="modal-style">
                    <div className='inputs-modal'>

                        <p>{MensagemModal}</p>

                        < div className='botoes-acao'>
                            {!ModalErro &&
                                <>
                                    <button className='botao' onClick={() => AcaoConfirmacao(DadoParaConfirmacao)}>Confirmar</button>
                                    <button className='botao' onClick={HandleFecharModal}>Cancelar</button>
                                </>
                            }
                            {
                                ModalErro &&
                                <button className='botao' onClick={HandleFecharModal}>Ok</button>
                            }
                        </div>

                    </div>
                </div>
            </div>
        </>
    )

    function ObterTituloModal() {
        return ModalErro ? "Erro" : "Aviso"
    }

}