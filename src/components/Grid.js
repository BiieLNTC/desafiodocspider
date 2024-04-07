import React, { useEffect, useState } from 'react';
import { Button, Tab, Table } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { BsFillPencilFill } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import { BsFillTrash3Fill } from "react-icons/bs";
import { IoMdDownload } from "react-icons/io";
import { Loader } from './Loader';

export const Grid = ({ RealizarAcoesGrid, AtualizarGrid }) => {
    const [arquivos, setArquivos] = useState();
    const [onInitializedCompleted, setOnInitializedCompleted] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            await obterListaArquivos();
        };

        fetchData();
    }, [AtualizarGrid]);

    return (
        <>
            {
                onInitializedCompleted &&
                <div className='grid'>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>
                                    Opções
                                </th>
                                <th>
                                    Título
                                </th>
                                <th>
                                    Descrição
                                </th>
                                <th>
                                    Nome do Arquivo
                                </th>
                                <th>
                                    Data
                                </th>
                                <th>
                                    Hora
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                arquivos && arquivos.length > 0
                                    ?
                                    arquivos.map(arquivo =>
                                        <tr key={arquivo.id}>
                                            <td style={{ padding: '.5rem' }}>
                                                <div className='buttons-grid'>
                                                    <BsFillPencilFill className='icon-grid' title='Editar' onClick={() => RealizarAcoesGrid("EDITAR", arquivo.id, '')} />
                                                    <BsSearch className='icon-grid' title='Visualizar' onClick={() => RealizarAcoesGrid("VISUALIZAR", arquivo.id, '')} />
                                                    <BsFillTrash3Fill className='icon-grid' title='Excluir' onClick={() => RealizarAcoesGrid("EXCLUIR", arquivo.id, '')} />
                                                    <IoMdDownload className='icon-grid' title='Download' onClick={() => RealizarAcoesGrid("BAIXAR", arquivo.conteudo, arquivo.nomeArquivo)} />
                                                </div>
                                            </td>
                                            <td className='description-cell' title={arquivo.titulo}>{arquivo.titulo}</td>
                                            <td className='description-cell' title={arquivo.descricao}>{arquivo.descricao}</td>
                                            <td className='description-cell' title={arquivo.nomeArquivo}>{arquivo.nomeArquivo}</td>
                                            <td className='description-cell'>{new Date(arquivo.dataCriacao).toLocaleDateString('pt-BR')}</td>
                                            <td className='description-cell'>{new Date(arquivo.dataCriacao).toLocaleTimeString('pt-BR')}</td>
                                        </tr>
                                    )
                                    :
                                    <tr>
                                        <td colSpan={6}>
                                            <span>Sem Registros</span>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </div>
            }
            {
                !onInitializedCompleted &&
                <Loader />
            }
        </>
    )

    async function obterListaArquivos() {
        const response = await fetch('https://localhost:44343/Arquivo/ObterTodosArquivos');
        const data = await response.json();
        setArquivos(data);

        setOnInitializedCompleted(true)
    }

}
