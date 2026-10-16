import { useState, useEffect } from "react";

interface Ticket {
    TICKETID: number;
    TITLE: string;
    DESCRIPTION: string;
    PRIORIDADE: string;
    STATUS: string;
    USERID: number;
    DATA_CRIACAO: string;
    role: string;
    USERNOME: string;
}

interface adminPageProps {
    role: string;
}

function GerenciarChamados( {role}: adminPageProps ){
    const [listaChamados, setListaChamados] = useState<Ticket[]>([]);
    const [statusSelecionados, setStatusSelecionados] = useState<{ [key: number]: string }>({});
    const [erro, setErro] = useState('');
    
    // Estado para controlar se está a carregar dados da API
    const [carregando, setCarregando] = useState(true);
    
    // Estado para saber qual ID de ticket está a ser atualizado no momento (para desativar o botão)
    const [idAtualizando, setIdAtualizando] = useState<number | null>(null);

        const apiUrl = "https://callsystem-production.up.railway.app";
    //const localApi = "http://localhost";

    useEffect(() => {
        const consultarChamados = async () => {
            try {
                setCarregando(true); // Liga o loading antes de buscar
                const token = localStorage.getItem('token');

                const response = await fetch(`${apiUrl}/tickets`, {
                    method: 'GET',
                    headers: { 
                        'content-type': 'application/json',
                        'Authorization' : `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setListaChamados(data.dados || data);
                } else {
                    setErro(data.Erro || 'Erro ao buscar chamados.');
                }
            } catch (err) {
                console.log('Ocorreu um erro ao consultar chamados', err);
                setErro('Não foi possível conectar ao servidor.');
            } finally {
                setCarregando(false); // Desliga o loading independentemente de dar sucesso ou erro
            }
        };

        consultarChamados();
    }, []);

    const mudarStatus = async (id: number) => {
        const token = localStorage.getItem('token');
        const ticketAtual = listaChamados.find(t => t.TICKETID === id);
        const statusParaEnviar = statusSelecionados[id] || ticketAtual?.STATUS || 'ABERTO';

        try {
            setIdAtualizando(id); // Ativa o loading específico deste botão/card
            const response = await fetch(`${apiUrl}/tickets/${id}`, {
                method: "PUT",
                headers: {
                    "content-type" : "application/json",
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: statusParaEnviar
                })
            });
            
            const data = await response.json()

            if(response.ok){
                console.log(data);
                setListaChamados(listaChamados.map(ticket => 
                    ticket.TICKETID === id ? { ...ticket, STATUS: statusParaEnviar } : ticket
                ));
            }else{
                console.log(data.Erro);
                setErro(data.Erro || 'Ocorreu um erro ao atualizar o status do chamado.');
            }

        } catch(err){
            console.log(err);
            setErro('Ocorreu um erro ao se conectar com o servidor');
        } finally {
            setIdAtualizando(null); // Desativa o loading do botão ao terminar
        }
    }

    return(
        <div className="container mt-4">
            {erro && <p className="bg-danger fw-bold text-white p-2 rounded">{erro}</p>}
            <h5 className="text-info text-center p-2">Somente o {role} pode atualizar o status do chamado</h5>
            {/* Se estiver carregando exibe o spinner */}
            {carregando ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="text-white visually-hidden ">Carregando...</span>
                    </div>
                    <p className="text-white mt-2 ">A carregar chamados...</p>
                </div>
            ) : listaChamados.length === 0 && !erro ? (
                <p className="text-center text-muted fw-bold">Nenhum chamado encontrado.</p>
            ) : (
                <div className="list-group">
                    {listaChamados.map((ticket) => (
                        <div key={ticket.TICKETID} className="list-group-item list-group-item-action mb-3 shadow-sm rounded">
                            <h5 className="mb-1 text-primary">{ticket.TITLE}</h5>
                            <p className="mb-1 text-muted">{ticket.DESCRIPTION}</p>
                            <small className="badge bg-secondary mb-2">Status atual: {ticket.STATUS}</small>
                            <small className="text-muted">{ticket.role}</small>
                            
                            {/* Atualiza o estado do chamado (aberto, em andamento ou finalizado) */}
                            <div className="d-flex gap-2 align-items-center mt-2">
                                <select 
                                    id={`status-${ticket.TICKETID}`}
                                    className="form-select w-auto"
                                    value={statusSelecionados[ticket.TICKETID] !== undefined ? statusSelecionados[ticket.TICKETID] : ticket.STATUS}
                                    onChange={(e) => setStatusSelecionados({
                                        ...statusSelecionados,
                                        [ticket.TICKETID]: e.target.value
                                    })}
                                >
                                    <option value="ABERTO">ABERTO</option>
                                    <option value="EM_ANDAMENTO">EM ANDAMENTO</option>
                                    <option value="FINALIZADO">FINALIZADO</option>
                                </select>

                                <button 
                                    type="button"
                                    className="btn btn-primary text-nowrap d-flex align-items-center gap-2"
                                    onClick={() => mudarStatus(ticket.TICKETID)}
                                    disabled={idAtualizando === ticket.TICKETID} // Desativa o botão enquanto salva
                                >
                                    {/* Se este botão específico está a carregar, mostra um mini spinner dentro dele */}
                                    {idAtualizando === ticket.TICKETID && (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    )}
                                    {idAtualizando === ticket.TICKETID ? 'Salvando...' : 'Alterar status'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default GerenciarChamados;