import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import '../../src/Style.css';
import { downloadBase64File, base64ToBlob } from '../utils/DownloadFile'
import { ConfirmarModal } from './ConfirmarModal';
import { FaSave } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { Tooltip } from 'react-tooltip';
import { Loader } from './Loader';

export const CadArquivo = ({ HandleValidSubmit, HandleFecharModal, isEdit, isView, arquivoId }) => {

    const [id, setId] = useState(null);
    const [titulo, setTitulo] = useState(null);
    const [descricao, setDescricao] = useState(null);
    const [arquivo, setArquivo] = useState(null);
    const [arquivoBase64, setArquivoBase64] = useState(null);
    const [nomeArquivo, setNomeArquivo] = useState('');
    const [visibilityModalErro, setVisibilityModalErro] = useState();
    const [onInitializedCompleted, setOnInitializedCompleted] = useState(false)

    const [erroTitulo, setErroTitulo] = useState(false)
    const [erroDescricao, setErroDescricao] = useState(false)
    const [erroArquivo, setErroArquivo] = useState(false)
    const [mensagemRetorno, setMensagemRetorno] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            await onInitialized();
        };

        fetchData();
    }, []);

    const ValidarCampos = () => {
        setErroTitulo(titulo === null || titulo === '')
        setErroDescricao(descricao === null || descricao === '')
        setErroArquivo(!arquivo)
    }

    return (
        <>
            <div className="modal-container">
                <div className='header-modal'>
                    <p>{ObterModoCad()}</p>
                    <button className='botao-fechar-modal' onClick={HandleFecharModal}>X</button>
                </div>
                <div className="modal-style">
                    <div className='inputs-modal'>
                        {
                            onInitializedCompleted &&
                            <>

                                <div className='form-group'>
                                    <label htmlFor='titulo'>Título</label>
                                    <input id='titulo' type='text' maxLength={100} value={titulo} onChange={o => setTitulo(o.target.value)} disabled={isView} />
                                    {erroTitulo && <p className='error-input'>Campo Obrigatório!</p>}
                                </div>

                                <div className='form-group'>
                                    <label htmlFor='descricao'>Descrição</label>
                                    <textarea id='descricao' maxLength={2000} value={descricao} onChange={o => setDescricao(o.target.value)} disabled={isView} />
                                    {erroDescricao && <p className='error-input'>Campo Obrigatório!</p>}
                                </div>

                                <div className='form-group'>
                                    <input type='file' id='arquivo' className='labelInput' disabled={isView} onChange={o => {
                                        if (o.target.files && o.target.files[0]) {
                                            setArquivo(o.target.files[0]);
                                            setNomeArquivo(o.target.files[0].name);
                                        }
                                    }} />
                                    {
                                        (isView || isEdit) &&
                                        <>
                                            <div className='two-inputs-wrapper'>
                                                <p>Arquivo Original: {nomeArquivo}</p>
                                                < div className='form-group botoes-acao'>
                                                    <button className='botao botao-download'
                                                        title="Baixar Arquivo"
                                                        onClick={() => downloadBase64File(arquivoBase64, nomeArquivo)}>
                                                        <IoMdDownload />
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    {erroArquivo && <p className='error-input'>Campo Obrigatório!</p>}
                                </div>
                                {
                                    !isView &&
                                    <div className='form-group'>
                                        < div className='botoes-acao'>
                                            <button className='botao' onClick={Salvar}><FaSave /> Salvar</button>
                                            <button className='botao' onClick={HandleFecharModal}><IoMdCloseCircle />Cancelar</button>
                                        </div>
                                    </div>
                                }
                            </>
                        }
                        {
                            !onInitializedCompleted &&
                            <Loader />
                        }
                    </div>
                </div>
            </div >

            {visibilityModalErro &&
                <ConfirmarModal ModalErro={true} HandleFecharModal={() => setVisibilityModalErro(!visibilityModalErro)} MensagemModal={mensagemRetorno} />
            }

        </>
    );

    async function onInitialized() {
        if (isEdit || isView) {

            const response = await fetch(`https://localhost:44343/Arquivo/ObterArquivoPorId/${arquivoId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            MontarArquivoObj(data)
        }

        setOnInitializedCompleted(true)
    }

    async function Salvar() {
        try {
            if ((titulo === null || titulo === '') || (descricao === null || descricao === '') || (!arquivo)) {
                setErroTitulo(titulo === null || titulo === '')
                setErroDescricao(descricao === null || descricao === '')
                setErroArquivo(!arquivo)
            }
            else {

                const base64String = await encodeFileToBase64(arquivo);

                let arquivoObj = {
                    id: id,
                    titulo: titulo,
                    descricao: descricao,
                    nomeArquivo: nomeArquivo,
                    dataCriacao: new Date(Date.now()),
                    conteudo: base64String
                };

                const url = isEdit ? 'https://localhost:44343/Arquivo/Atualizar' : 'https://localhost:44343/Arquivo/Cadastrar';

                const response = await fetch(url, {
                    method: isEdit ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(arquivoObj),
                });

                const data = await response.json();

                if (data != null && data.mensagemRetorno == null)
                    HandleValidSubmit();
                else {
                    setVisibilityModalErro(true);
                    setMensagemRetorno(data.mensagemRetorno)
                }
            }

        } catch (error) {
            toast.error(`Erro ao ${isEdit ? "Editar" : "Cadastrar"} o arquivo!`);
            console.error('Erro ao salvar o arquivo:', error);
        }
    }

    function encodeFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    }

    function ObterModoCad() {
        let modo = ""

        if (isEdit) {
            modo = "Editar";
        }
        else if (isView) {
            modo = "Visualizar"
        }
        else {
            modo = "Cadastrar"
        }

        return `${modo} Arquivo`
    }

    function MontarArquivoObj(data) {
        setTitulo(data.titulo)
        setDescricao(data.descricao)
        setNomeArquivo(data.nomeArquivo)
        setArquivo(base64ToBlob(data.conteudo))
        setArquivoBase64(data.conteudo)
    }

};
