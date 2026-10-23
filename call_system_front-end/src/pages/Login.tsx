import { useState} from "react";

export interface Usuario {
    id?: number;
    nome?: string;
    email?: string;
    role?: string; // Deixe opcional ou adicione caso venha do back-end
    [key: string]: unknown; // Permite qualquer outra propriedade extra que venha da API
}

interface LoginPageProps {
    onLoginSuccess: (Usuario:null) => void;
}

function LoginPage({onLoginSuccess}: LoginPageProps){

    const [inputEmailUser, setInputEmailUser] = useState('');
    const [inputSenha, setInputSenha] = useState('');
    const [erro, setErro] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErro('');

        try{

            const response = await fetch(`https://callsystem-production.up.railway.app/login`, {
                method: 'POST',
                headers: {
                    'content-type' : 'application/json',
                },
                body: JSON.stringify({
                    useremail : inputEmailUser,
                    userpassword : inputSenha
                })
            });

            if(response.status == 429){
                setErro("Você atingiu o número de tentativas de log-in, tente mais tarde...");
                return;
            }

            const data = await response.json()

            if(response.ok){
                alert(data.mensagem || `Login bem sucedido!.`);

                localStorage.setItem('token', data.token)

                onLoginSuccess(data.usuario);
                
            }else{
                alert(data.Erro || `Ocorreu um erro ao realizar o login.`);
            }
        }
        catch(err){
            console.log('ocorreu um erro ao conectar com banco de dados', err);
        }
    }

    return(
        <main className="auth-page">
            <title>login</title>
            <section className="auth-card" aria-labelledby="login-title">
                <header className="page-heading auth-heading">
                    <span className="eyebrow">Sistema de atendimento</span>
                    <h1 id="login-title">Acesse sua conta</h1>
                    <p>Entre para abrir chamados ou acompanhar solicitações.</p>
                </header>
                <form onSubmit={handleSubmit} className="form-stack">
                {erro && <div className="feedback feedback-error" role="alert">{erro}</div>}
                <div className="field">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            className="text-input"
                            type="text"
                            id="email" 
                            placeholder="seu@email.com"
                            aria-label="Email"
                            value={inputEmailUser}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputEmailUser(e.target.value)}    
                        />
                    </div>
                </div>
                <div className="field">
                    <div>
                        <label htmlFor="senha">Senha</label>
                        <input
                            className="text-input"
                            type="password"
                            id="senha"
                            placeholder="Digite sua senha"
                            aria-label="Senha"
                            value={inputSenha}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputSenha(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <button type="submit" className="button button-primary button-full">Entrar</button>
                </div>
            </form>
            </section>
        </main>
    )
}

export default LoginPage;