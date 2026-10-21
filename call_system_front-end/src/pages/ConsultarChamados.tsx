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

    const classePrioridade = (prioridade: string) => {
        switch (prioridade.trim().toLowerCase()) {
            case 'baixa':
                return 'ticket-badge ticket-badge-low';
            case 'media':
            case 'média':
                return 'ticket-badge ticket-badge-medium';
            case 'alta':
                return 'ticket-badge ticket-badge-high';
            default:
                return 'ticket-badge ticket-badge-neutral';
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
        <div className="page-container">
            <header className="page-heading page-heading-row">
                <div>
                    <span className="page-eyebrow">Acompanhamento</span>
                    <h1>Seus chamados</h1>
                    <p>Acompanhe as solicitações registradas e seus detalhes.</p>
                </div>
                {!carregando && !erro && (
                    <span className="page-count">{listaChamados.length} {listaChamados.length === 1 ? 'chamado' : 'chamados'}</span>
                )}
            </header>

            {erro && <div className="page-alert page-alert-error" role="alert">{erro}</div>}

            {carregando ? (
                <div className="page-state" role="status" aria-live="polite">
                    <span className="page-spinner" aria-hidden="true" />
                    <strong>Carregando chamados</strong>
                    <span>Estamos buscando suas solicitações.</span>
                </div>
            ) : listaChamados.length === 0 && !erro ? (
                <div className="page-state">
                    <span className="page-state-icon" aria-hidden="true">▤</span>
                    <strong>Nenhum chamado encontrado</strong>
                    <span>Quando houver solicitações, elas aparecerão aqui.</span>
                </div>
            ) : (
                <section className="ticket-list" aria-label="Lista de chamados">
                    {listaChamados.map((ticket) => (
                        <article key={ticket.TICKETID} className="ticket-card">
                            <div className="ticket-card-top">
                                <div>
                                    <span className="ticket-id">Chamado #{ticket.TICKETID}</span>
                                    <h2>{ticket.TITLE}</h2>
                                </div>
                                <span className={classePrioridade(ticket.PRIORIDADE)}>{ticket.PRIORIDADE}</span>
                            </div>
                            <p className="ticket-description">{ticket.DESCRIPTION}</p>
                            <div className="ticket-card-footer">
                                <span className="ticket-status"><span aria-hidden="true" />{ticket.STATUS}</span>
                                <span>Aberto em {formatarData(ticket.DATA_CRIACAO)}</span>
                                <span>Usuário #{ticket.USERID}</span>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}

export default ConsultarChamado;