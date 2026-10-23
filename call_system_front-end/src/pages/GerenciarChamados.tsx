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

    useEffect(() => {
        const consultarChamados = async () => {
            try {
                setCarregando(true); // Liga o loading antes de buscar
                const token = localStorage.getItem('token');

                const response = await fetch(`https://callsystem-production.up.railway.app/tickets`, {
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
            const response = await fetch(`https://callsystem-production.up.railway.app/tickets/${id}`, {
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

    const deletarTicket = async (id: number) => {
        if (!window.confirm(`Deseja realmente deletar o chamado #${id}?`)) {
            return;
        }

        try {

            const token = localStorage.getItem('token');

            // Substitui o :id pelo número real do ticket na URL
            const response = await fetch(`https://callsystem-production.up.railway.app/tickets/${id}`, {
                method: 'DELETE',
                headers: { 
                    'content-type': 'application/json',
                    'Authorization' : `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.mensagem || 'Chamado deletado com sucesso');
                // Atualiza a lista na tela automaticamente removendo o item deletado
                setListaChamados(listaChamados.filter(ticket => ticket.TICKETID !== id));
            } else {
                alert(data.Erro || 'Erro ao deletar chamado');
            }
        } catch (err) {
            console.log('Ocorreu um erro ao deletar o chamado', err);
            alert('Não foi possível conectar ao servidor para deletar.');
        }
    };

    return(
        <main className="module-card">
            <header className="page-heading">
                <span className="eyebrow">Administração</span>
                <h1>Gerenciar chamados</h1>
                <p>Atualize o andamento das solicitações ou remova chamados que não são mais necessários.</p>
            </header>
            {erro && <p className="feedback feedback-error" role="alert">{erro}</p>}
            <p className="permission-note">Somente o perfil {role} pode atualizar o status dos chamados.</p>
            {/* Se estiver carregando exibe o spinner */}
            {carregando ? (
                <div className="loading-state" role="status">
                    <span className="loading-spinner" aria-hidden="true"></span>
                    <span>Carregando chamados...</span>
                </div>
            ) : listaChamados.length === 0 && !erro ? (
                <div className="empty-state">
                    <h2>Nenhum chamado encontrado</h2>
                    <p>Quando houver solicitações, elas aparecerão aqui para gerenciamento.</p>
                </div>
            ) : (
                <div className="ticket-list">
                    {listaChamados.map((ticket) => (
                        <article key={ticket.TICKETID} className="ticket-card">
                            <h2>{ticket.TITLE}</h2>
                            <p className="ticket-description">{ticket.DESCRIPTION}</p>
                            <div className="ticket-meta">
                                <span className="status-pill status-neutral">Status atual: {ticket.STATUS}</span>
                                <span className="ticket-reference">{ticket.role}</span>
                            </div>
                            
                            {/* Atualiza o estado do chamado (aberto, em andamento ou finalizado) */}
                            <div className="ticket-actions">
                                <select 
                                    id={`status-${ticket.TICKETID}`}
                                    className="text-input status-select"
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

                                {/* Botão para atualizar status do chamado */}
                                <button 
                                    type="button"
                                    className="button button-primary"
                                    onClick={() => mudarStatus(ticket.TICKETID)}
                                    disabled={idAtualizando === ticket.TICKETID} // Desativa o botão enquanto salva
                                >
                                    {/* Se este botão específico está a carregar, mostra um mini spinner dentro dele */}
                                    {idAtualizando === ticket.TICKETID && (
                                        <span className="loading-spinner loading-spinner-small" role="status" aria-label="Salvando"></span>
                                    )}
                                    {idAtualizando === ticket.TICKETID ? 'Salvando...' : 'Alterar status'}
                                </button>

                                {/* Botão de deletar individual para cada chamado */}
                                <button 
                                    onClick={() => deletarTicket(ticket.TICKETID)} 
                                    className="button button-danger"
                                >
                                    Excluir
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default GerenciarChamados;