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

    // Deixa cada prioridade com uma cor de destaque.
    const classePrioridade = (prioridade: string) => {
        switch (prioridade.trim().toLowerCase()) {
            case 'baixa':
                return 'bg-success';
            case 'media':
            case 'média':
                return 'bg-warning text-dark';
            case 'alta':
                return 'bg-danger';
            default:
                return 'bg-secondary';
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

        
    const deletarTicket = async (id: number) => {
        if (!window.confirm(`Deseja realmente deletar o chamado #${id}?`)) {
            return;
        }

        try {
            // Substitui o :id pelo número real do ticket na URL
            const response = await fetch(`https://callsystem-production.up.railway.app:3036/tickets/${id}`, {
                method: 'DELETE',
                headers: { 'content-type': 'application/json' }
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

    useEffect(() => {
        const consultarChamados = async () => {
            try {
                const response = await fetch('https://callsystem-production.up.railway.app:3036/tickets', {
                    method: 'GET',
                    headers: { 'content-type': 'application/json' }
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
            }
        };

        consultarChamados();
    }, []);

    return (
        <div className="container mt-4">
            <h3 className="mb-3 text-center">Lista de Chamados</h3>
            
            {erro && <div className="alert alert-danger">{erro}</div>}

            {listaChamados.length === 0 && !erro ? (
                <p className="text-center text-muted">Nenhum chamado encontrado.</p>
            ) : (
                <div className="list-group">
                    {listaChamados.map((ticket) => (
                        <div key={ticket.TICKETID} className="list-group-item list-group-item-action mb-3 shadow-sm rounded">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-1 text-primary">{ticket.TITLE}</h5>
                                <div className="d-flex gap-2 align-items-center">
                                    <small className={`badge ${classePrioridade(ticket.PRIORIDADE)}`}>Prioridade: {ticket.PRIORIDADE}</small>
                                    <small className="badge bg-secondary">Status: {ticket.STATUS}</small>
                                    <small className="badge bg-secondary">Criação: {formatarData(ticket.DATA_CRIACAO)}</small>
                                    {/* Botão de deletar individual para cada chamado */}
                                    <button 
                                        onClick={() => deletarTicket(ticket.TICKETID)} 
                                        className="btn btn-danger btn-sm rounded"
                                    >Excluir</button>
                                </div>
                            </div>

                            <p className="mb-1 text-break mt-2">{ticket.DESCRIPTION}</p>
                            <small className="text-muted">ID do Chamado: #{ticket.TICKETID} | Usuário: {ticket.USERID}</small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ConsultarChamado;