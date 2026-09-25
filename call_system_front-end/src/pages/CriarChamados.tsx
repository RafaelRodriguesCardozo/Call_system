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

    // Busca a rota de Post no back-end para criar um ticket
    const criarTicket = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        try{
            const response = await fetch('http://localhost:3036/tickets', {
                method: 'POST',
                headers: {'content-type' : 'application/json'},
                body: JSON.stringify({
                    title : inputTitulo,
                    description : inputDescricao,
                    userId : userId,
                    prioridade : inputPrioridade
                })
            });

            const data = await response.json();
            
            if(response.ok){
                alert('cahamado criado com sucesso');
                console.log(data.mensagem);
            }
        }catch(err){
            console.log('ocorreu um erro ao criar seu chamado', err);
            alert('ocorreu um erro ao criar seu chamado!')
        }
    }

    return(
        <div className="m-4 container">
            <title>Criar Chamados</title>
            <div className="w-100 text-center mb-5">
                <h1>Criar chamados</h1>
                <p>crie um ticket para relatar seu problemalogo em seguida ele será visto e solucionado por um técnico</p>

            </div>

            <form onSubmit={criarTicket} className="d-flex flex-column justify-content-center">
                <div className="w-100 mb-3">
                    <div>
                        <label htmlFor="titulo" className="form-label fw-bolder">Insira o Título</label>
                        <input 
                            type="text"
                            className="form-control"
                            placeholder="Insira o titulo do chamado..."
                            id="titulo"
                            value={inputTitulo}
                            onChange={(e) => setInputTitulo(e.target.value)}    
                        />
                    </div>
                </div>
                <div className="w-100 mb-3">
                    <div>
                        <label htmlFor="descricao" className="form-label fw-bolder">Insira a descrição do chamado</label>
                        <textarea 
                            className="form-control"
                            placeholder="Descrição do chamado..."
                            id="descricao"
                            value={inputDescricao}
                            onChange={(e) => setInputDescricao(e.target.value)}
                        />
                    </div>                 
                </div>
                <div className="w-100 mb-3">
                    <div>
                        <label htmlFor="prioridade" className="form-label fw-bolder">Selecione a prioridade</label>
                        <select 
                            className="form-select mb-3" 
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

                <button type="submit" className="btn btn-primary">Criar chamado</button>
            </form>
        </div>
    )
}

export default CriarChamado;