import type React from "react";
import { useState } from "react";

// Declara que o userId espera um número ao invés de uma string na prop.
interface criarChamadoProps {
    userId: number;
}

function CriarChamado({userId}: criarChamadoProps) {

    const[inputTitulo, setInputTitulo] = useState('');
    const[inputDescricao, setInputDescricao] = useState('');
    const[inputPrioridade, setInputPrioridade] = useState('MÉDIA');
    const[Erro, setErro] = useState('');

    const limiteCaracteres = 500;

    // Busca a rota de Post no back-end para criar um ticket
    const criarTicket = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        setErro('');

        try{ 

            const token = localStorage.getItem('token');

            const response = await fetch(`https://callsystem-production.up.railway.app/tickets`, {
                method: 'POST',
                headers: {
                    'content-type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify({
                    title : inputTitulo,
                    description : inputDescricao,
                    userId : userId,
                    prioridade : inputPrioridade
                })
            });

            if(!inputTitulo || !inputDescricao || !inputPrioridade ){
                setErro('Todas as áreas tem que ser preenchidas');
            }

            if(inputDescricao.length > limiteCaracteres){
                setErro('O limite máximo de caracteres é 200');
            }

            const data = await response.json();
            
            if(response.ok){
                alert('chamado criado com sucesso');
                console.log(data.mensagem);
            }
        }catch(err){
            console.log('ocorreu um erro ao criar seu chamado', err);
            alert('ocorreu um erro ao criar seu chamado!')
        }
    }

    return(
        <main className="module-card">
            <title>Criar Chamados</title>
            <header className="page-heading">
                <span className="eyebrow">Solicitações</span>
                <h1>Criar chamado</h1>
                <p>Descreva o problema e escolha a prioridade. A equipe poderá acompanhar sua solicitação.</p>
            </header>

            <form onSubmit={criarTicket} className="form-stack">
                {Erro && <div className="feedback feedback-error" role="alert">{Erro}</div>}
                <div className="field">
                    <div>
                        <label htmlFor="titulo">Título do chamado</label>
                        <input 
                            type="text"
                            className="text-input"
                            placeholder="Ex.: Não consigo acessar meu email"
                            id="titulo"
                            value={inputTitulo}
                            onChange={(e) => setInputTitulo(e.target.value)}    
                        />
                    </div>
                </div>
                <div className="field">
                    <div>
                        <label htmlFor="descricao">Descreva o problema</label>
                        <textarea 
                            className="text-input text-area"
                            placeholder="Conte o que aconteceu e o que você já tentou fazer."
                            id="descricao"
                            value={inputDescricao}
                            onChange={(e) => setInputDescricao(e.target.value)}
                        />
                    </div>                 
                </div>
                <div className="field">
                    <div>
                        <label htmlFor="prioridade">Prioridade</label>
                        <select
                            className="text-input"
                            id="prioridade"
                            value={inputPrioridade}
                            onChange={(e) => setInputPrioridade(e.target.value)}
                        >
                            <option value="BAIXA">Baixa</option>
                            <option value="MÉDIA">Média</option>
                            <option value="ALTA">Alta</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="button button-primary">Enviar chamado</button>
            </form>
        </main>
    )
}

export default CriarChamado;