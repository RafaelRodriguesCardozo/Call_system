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
        <div className="page-container">
            <header className="page-heading page-heading-row">
                <div>
                    <span className="page-eyebrow">Painel administrativo</span>
                    <h1>Gerenciar chamados</h1>
                    <p>Atualize o andamento das solicitações e mantenha a fila organizada.</p>
                </div>
                {!carregando && !erro && (
                    <span className="page-count">{listaChamados.length} {listaChamados.length === 1 ? 'chamado' : 'chamados'}</span>
                )}
            </header>

            {erro && <div className="page-alert page-alert-error" role="alert">{erro}</div>}
            <p className="page-permission-note">
                <span aria-hidden="true">i</span>
                Ações administrativas disponíveis para <strong>{role}</strong>
            </p>

            {carregando ? (
                <div className="page-state" role="status" aria-live="polite">
                    <span className="page-spinner" aria-hidden="true" />
                    <strong>Carregando chamados</strong>
                    <span>Estamos buscando as solicitações cadastradas.</span>
                </div>
            ) : listaChamados.length === 0 && !erro ? (
                <div className="page-state">
                    <span className="page-state-icon" aria-hidden="true">▤</span>
                    <strong>Nenhum chamado encontrado</strong>
                    <span>Os novos chamados aparecerão aqui.</span>
                </div>
            ) : (
                <section className="ticket-list" aria-label="Chamados para gerenciamento">
                    {listaChamados.map((ticket) => (
                        <article key={ticket.TICKETID} className="ticket-card">
                            <div className="ticket-card-top">
                                <div>
                                    <span className="ticket-id">Chamado #{ticket.TICKETID}</span>
                                    <h2>{ticket.TITLE}</h2>
                                </div>
                                <span className={`ticket-badge ${ticket.STATUS === 'FINALIZADO' ? 'ticket-badge-low' : 'ticket-badge-neutral'}`}>
                                    {ticket.STATUS.replace('_', ' ')}
                                </span>
                            </div>
                            <p className="ticket-description">{ticket.DESCRIPTION}</p>
                            <div className="ticket-card-footer">
                                <span>Solicitante: {ticket.USERNOME || `#${ticket.USERID}`}</span>
                                <span>Prioridade: {ticket.PRIORIDADE}</span>
                                <span>{ticket.role}</span>
                            </div>
                            <div className="ticket-admin-actions">
                                <div className="page-field ticket-status-field">
                                    <label htmlFor={`status-${ticket.TICKETID}`}>Atualizar status</label>
                                    <select
                                        id={`status-${ticket.TICKETID}`}
                                        className="form-select"
                                        value={statusSelecionados[ticket.TICKETID] !== undefined ? statusSelecionados[ticket.TICKETID] : ticket.STATUS}
                                        onChange={(e) => setStatusSelecionados({
                                            ...statusSelecionados,
                                            [ticket.TICKETID]: e.target.value
                                        })}
                                    >
                                        <option value="ABERTO">Aberto</option>
                                        <option value="EM_ANDAMENTO">Em andamento</option>
                                        <option value="FINALIZADO">Finalizado</option>
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    className="page-button page-button-primary"
                                    onClick={() => mudarStatus(ticket.TICKETID)}
                                    disabled={idAtualizando === ticket.TICKETID}
                                    aria-busy={idAtualizando === ticket.TICKETID}
                                >
                                    {idAtualizando === ticket.TICKETID ? 'Salvando...' : 'Salvar status'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => deletarTicket(ticket.TICKETID)}
                                    className="page-button page-button-danger"
                                >
                                    Excluir chamado
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}

export default GerenciarChamados;