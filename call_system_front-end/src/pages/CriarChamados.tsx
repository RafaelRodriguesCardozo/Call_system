import { useState, type FormEvent } from "react";
import "./CriarChamados.css";

interface CriarChamadoProps {
    userId: number;
}

interface RespostaApi {
    mensagem?: string;
    Erro?: string;
    erro?: string;
}

const LIMITE_CARACTERES = 500;

function CriarChamado({ userId }: CriarChamadoProps) {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [prioridade, setPrioridade] = useState("MÉDIA");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [enviando, setEnviando] = useState(false);

    const criarTicket = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErro("");
        setSucesso("");

        if (!titulo.trim() || !descricao.trim()) {
            setErro("Preencha o título e a descrição para continuar.");
            return;
        }

        if (descricao.length > LIMITE_CARACTERES) {
            setErro(`A descrição deve ter no máximo ${LIMITE_CARACTERES} caracteres.`);
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setErro("Sua sessão não foi encontrada. Entre novamente para criar um chamado.");
            return;
        }

        setEnviando(true);

        try {
            const response = await fetch("https://callsystem-production.up.railway.app/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: titulo.trim(),
                    description: descricao.trim(),
                    userId,
                    prioridade,
                }),
            });

            let data: RespostaApi;

            try {
                data = await response.json() as RespostaApi;
            } catch {
                setErro("O servidor enviou uma resposta inválida. Tente novamente.");
                return;
            }

            if (!response.ok) {
                setErro(data.Erro || data.erro || "Não foi possível criar o chamado. Tente novamente.");
                return;
            }

            setSucesso(data.mensagem || "Chamado criado com sucesso. Nossa equipe dará sequência ao atendimento.");
            setTitulo("");
            setDescricao("");
            setPrioridade("MÉDIA");
        } catch {
            setErro("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <main className="create-ticket-page">
            <title>Criar chamado</title>

            <header className="create-ticket-header">
                <span className="create-ticket-eyebrow">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3.5 20 7v5.2c0 4.3-3.4 7.2-8 8.8-4.6-1.6-8-4.5-8-8.8V7l8-3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                        <path d="m8.8 12 2.1 2.1 4.4-4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Central de suporte
                </span>
                <h1>Como podemos ajudar?</h1>
                <p>
                    Abra um chamado com os detalhes do que aconteceu. Nossa equipe vai analisar
                    sua solicitação e acompanhar a resolução.
                </p>
            </header>

            <div className="create-ticket-layout">
                <section className="create-ticket-card" aria-labelledby="ticket-form-title">
                    <div className="create-ticket-card-heading">
                        <div>
                            <span className="create-ticket-step">Nova solicitação</span>
                            <h2 id="ticket-form-title">Descreva seu problema</h2>
                            <p>Campos marcados com <span aria-hidden="true">*</span> são obrigatórios.</p>
                        </div>
                        <span className="create-ticket-card-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </span>
                    </div>

                    {erro && (
                        <div className="create-ticket-alert create-ticket-alert-error" role="alert">
                            <strong>Não foi possível enviar</strong>
                            <span>{erro}</span>
                        </div>
                    )}
                    {sucesso && (
                        <div className="create-ticket-alert create-ticket-alert-success" role="status">
                            <strong>Solicitação enviada</strong>
                            <span>{sucesso}</span>
                        </div>
                    )}

                    <form onSubmit={criarTicket} noValidate>
                        <div className="create-ticket-field">
                            <label htmlFor="ticket-title">
                                Título do chamado <span aria-hidden="true">*</span>
                            </label>
                            <input
                                id="ticket-title"
                                name="title"
                                type="text"
                                placeholder="Ex.: Não consigo acessar minha conta"
                                value={titulo}
                                onChange={(event) => {
                                    setTitulo(event.target.value);
                                    setErro("");
                                    setSucesso("");
                                }}
                                required
                                aria-required="true"
                                aria-invalid={Boolean(erro && !titulo.trim())}
                                aria-describedby="ticket-title-hint"
                            />
                            <small id="ticket-title-hint">Resuma o problema em uma frase.</small>
                        </div>

                        <div className="create-ticket-field">
                            <div className="create-ticket-label-row">
                                <label htmlFor="ticket-description">
                                    Descrição <span aria-hidden="true">*</span>
                                </label>
                                <span className="create-ticket-counter" aria-live="polite">
                                    {descricao.length}/{LIMITE_CARACTERES}
                                </span>
                            </div>
                            <textarea
                                id="ticket-description"
                                name="description"
                                placeholder="Conte o que aconteceu, quando começou e quais passos você já tentou."
                                value={descricao}
                                onChange={(event) => {
                                    setDescricao(event.target.value);
                                    setErro("");
                                    setSucesso("");
                                }}
                                rows={6}
                                maxLength={LIMITE_CARACTERES}
                                required
                                aria-required="true"
                                aria-invalid={Boolean(erro && !descricao.trim())}
                                aria-describedby="ticket-description-hint"
                            />
                            <small id="ticket-description-hint">
                                Inclua detalhes que ajudem nossa equipe a entender a situação.
                            </small>
                        </div>

                        <div className="create-ticket-field">
                            <label htmlFor="ticket-priority">Prioridade</label>
                            <select
                                id="ticket-priority"
                                name="priority"
                                value={prioridade}
                                onChange={(event) => {
                                    setPrioridade(event.target.value);
                                    setErro("");
                                    setSucesso("");
                                }}
                            >
                                <option value="BAIXA">Baixa — posso aguardar</option>
                                <option value="MÉDIA">Média — preciso de ajuda em breve</option>
                                <option value="ALTA">Alta — estou impedido de trabalhar</option>
                            </select>
                            <small>Escolha conforme o impacto do problema no seu trabalho.</small>
                        </div>

                        <div className="create-ticket-form-footer">
                            <span>Você poderá acompanhar o andamento em “Consultar chamados”.</span>
                            <button type="submit" disabled={enviando} aria-busy={enviando}>
                                {enviando ? (
                                    <>
                                        <span className="create-ticket-spinner" aria-hidden="true" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        Enviar chamado
                                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>

                <aside className="create-ticket-aside" aria-labelledby="ticket-tips-title">
                    <div className="create-ticket-aside-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M9 18h6m-5 3h4m-2-19a7 7 0 0 0-4.2 12.6c.7.5 1.2 1.2 1.2 2.1h4c0-.9.5-1.6 1.2-2.1A7 7 0 0 0 12 2Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2 id="ticket-tips-title">Dicas para agilizar</h2>
                    <p>Uma descrição clara ajuda nossa equipe a encontrar a solução mais rápido.</p>
                    <ul>
                        <li>
                            <span aria-hidden="true">1</span>
                            Explique o que você estava tentando fazer.
                        </li>
                        <li>
                            <span aria-hidden="true">2</span>
                            Informe mensagens de erro, se houver.
                        </li>
                        <li>
                            <span aria-hidden="true">3</span>
                            Selecione a prioridade conforme o impacto.
                        </li>
                    </ul>
                    <div className="create-ticket-aside-note">
                        <span aria-hidden="true">i</span>
                        <p>Evite incluir senhas ou outras informações confidenciais na descrição.</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}

export default CriarChamado;
