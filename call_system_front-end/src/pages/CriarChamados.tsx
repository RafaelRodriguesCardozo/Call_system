import type React from "react";
import { useState } from "react";

interface criarChamadoProps {
    userId: number;
}

function CriarChamado({userId}: criarChamadoProps) {

    const[inputTitulo, setInputTitulo] = useState('');
    const[inputDescricao, setInputDescricao] = useState('');
    const[inputPrioridade, setInputPrioridade] = useState('MÉDIA');

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
        <div className="m-4">
            <form onSubmit={criarTicket}>
                <div className="row g-3">
                    <div className=" col-sm-5 mb-3">
                        <input 
                            type="text"
                            className="form-control"
                            placeholder="Insira o titulo do chamado"
                            value={inputTitulo}
                            onChange={(e) => setInputTitulo(e.target.value)}    
                        />
                    </div>
                </div>
                <div className="row g-3">
                    <div className=" col-sm-5 mb-3">
                        <input 
                            type="text"
                            className="form-control"
                            placeholder="Insira a descrição do chamado"
                            value={inputDescricao}
                            onChange={(e) => setInputDescricao(e.target.value)}
                        />
                    </div>                 
                </div>
                <div className="row g-3">
                    <div  className=" col-sm-5">
                        <label htmlFor="prioridade" className="form-label">Selecione a prioridade</label>
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