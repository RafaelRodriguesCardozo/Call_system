import { useState, useEffect } from "react";

interface Ticket {
    TICKETID: number;
    TITLE: string;
    DESCRIPTION: string;
    PRIORIDADE: string;
    STATUS: string;
    USERID: number;
    DATA_CRIACAO: string;
}

function ConsultarChamado() {
    const [listaChamados, setListaChamados] = useState<Ticket[]>([]);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(true);

    // Deixa cada prioridade com uma cor de destaque.
    const classePrioridade = (prioridade: string) => {
        switch (prioridade.trim().toLowerCase()) {
            case 'baixa':
                return 'priority-low';
            case 'media':
            case 'média':
                return 'priority-medium';
            case 'alta':
                return 'priority-high';
            default:
                return 'priority-default';
        }
    };

    // Mostra data e hora que chamado foi criado.
    const formatarData = (dataIso: string) => {
            if (!dataIso) return '';
            try {
                return new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(new Date(dataIso));
            } catch {
                return dataIso; // Fallback caso a string da data seja inválida
            }
        };

    useEffect(() => {
        const consultarChamados = async () => {
            try {

                // Ao fazer a requisição ativa o evento de carregamento
                setCarregando(true);

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

                    setListaChamados(data.dados);
                } else {
                    setErro(data.Erro || 'Erro ao buscar chamados.');
                }
            } catch (err) {
                console.log('Ocorreu um erro ao consultar chamados', err);
                setErro('Não foi possível conectar ao servidor.');
            } finally {
                // Finaliza o evento de carregamento ao Carregar os elementos na tela
                setCarregando(false);
            }
        };

        consultarChamados();
    }, []);

    return (
        <main className="module-card">
            <header className="page-heading">
                <span className="eyebrow">Acompanhamento</span>
                <h1>Consultar chamados</h1>
                <p>Acompanhe o status, a prioridade e a data de abertura de cada solicitação.</p>
            </header>
            
            {erro && <div className="feedback feedback-error" role="alert">{erro}</div>}

            {carregando ? (
                <div className="loading-state" role="status">
                    <span className="loading-spinner" aria-hidden="true"></span>
                    <span>Carregando chamados...</span>
                </div>
            ) : listaChamados.length === 0 && !erro ? (
                <div className="empty-state">
                    <h2>Nenhum chamado encontrado</h2>
                    <p>Quando houver solicitações, elas aparecerão aqui.</p>
                </div>
            ) : (
                <div className="ticket-list">
                    {listaChamados.map((ticket) => (
                        <article key={ticket.TICKETID} className="ticket-card">
                            <div className="ticket-heading">
                                <h2>{ticket.TITLE}</h2>
                                <div className="ticket-meta">
                                    <span className={`status-pill ${classePrioridade(ticket.PRIORIDADE)}`}>Prioridade: {ticket.PRIORIDADE}</span>
                                    <span className="status-pill status-neutral">Status: {ticket.STATUS}</span>
                                    <span className="status-pill status-neutral">Criação: {formatarData(ticket.DATA_CRIACAO)}</span>
                                </div>
                            </div>

                            <p className="ticket-description">{ticket.DESCRIPTION}</p>
                            <small className="ticket-reference">Chamado #{ticket.TICKETID} · Usuário {ticket.USERID}</small>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default ConsultarChamado;