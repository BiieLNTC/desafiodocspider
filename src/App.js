import { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid } from './components/Grid';
import { CadArquivo } from './components/CadArquivo';
import './App.css';
import '../src/Style.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { downloadBase64File } from "./utils/DownloadFile"
import { ConfirmarModal } from './components/ConfirmarModal';
import { FaPlus } from "react-icons/fa";

function App() {

  const [visibilityCad, setVisibilityCad] = useState();
  const [visibilityConfirmarModal, setVisibilityConfirmarModal] = useState(false);
  const [dadoParaExcluir, setDadoParaExcluir] = useState();
  const [isEditMode, setIsEditMode] = useState();
  const [isViewMode, setIsViewMode] = useState();
  const [arquivoId, setArquivoId] = useState();
  const [atualizarGrid, setAtualizarGrid] = useState(false);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>MyArquivos</h1>
        </header>
        <div className='conteudos'>
          <button className='botao botao-adicionar' onClick={HandleAbrirModal}><FaPlus />Cadastrar</button>
          <Grid RealizarAcoesGrid={RealizarAcoesGrid} AtualizarGrid={atualizarGrid} />
        </div>
      </div>

      {visibilityCad && <CadArquivo HandleValidSubmit={OnValidSubmit} HandleFecharModal={HandleFecharModal} isEdit={isEditMode} isView={isViewMode} arquivoId={arquivoId} />}

      {visibilityConfirmarModal &&
        <ConfirmarModal AcaoConfirmacao={DeleteArquivo} HandleFecharModal={AlterarVisibilidadeModalConfirmacao} DadoParaConfirmacao={dadoParaExcluir} MensagemModal={"Deseja excluir esse registro?"} />}

      <ToastContainer theme='light' position="bottom-right" />
    </>

  );

  function HandleAbrirModal() {
    setVisibilityCad(true)
    setIsViewMode(false)
    setIsEditMode(false)
    setArquivoId(0)
  }

  function HandleFecharModal() {
    setVisibilityCad(false)
  }

  function AlterarVisibilidadeModalConfirmacao() {
    setVisibilityConfirmarModal(!visibilityConfirmarModal)
  }

  async function OnValidSubmit() {
    HandleFecharModal();
    toast.success(`Sucesso ao ${isEditMode ? "Editar" : "Cadastrar"} o arquivo!`);
    await AtualizarGrid();
  }

  async function RealizarAcoesGrid(acao, args, nomeArquivo) {
    switch (acao) {
      case "EDITAR":
        setVisibilityCad(true)
        setIsEditMode(true)
        setIsViewMode(false)
        setArquivoId(args)
        break
      case "VISUALIZAR":
        setVisibilityCad(true)
        setIsViewMode(true)
        setIsEditMode(false)
        setArquivoId(args)
        break;
      case "EXCLUIR":
        setDadoParaExcluir(args)
        ConfirmarExclusao()
        break;
      case "BAIXAR":
        await downloadBase64File(args, nomeArquivo)
    }
  }

  async function ConfirmarExclusao() {
    AlterarVisibilidadeModalConfirmacao()
  }

  async function DeleteArquivo(id) {

    AlterarVisibilidadeModalConfirmacao()

    const response = await fetch(`https://localhost:44343/Arquivo/Excluir/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data) {
      toast.success('Sucesso ao Excluir!');
      await AtualizarGrid();
    }
    else
      toast.error('Erro ao excluir!');

  }

  async function AtualizarGrid() {
    setAtualizarGrid(!atualizarGrid)
  }

}

export default App;
