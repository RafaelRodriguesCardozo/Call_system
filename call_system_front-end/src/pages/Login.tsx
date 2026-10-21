import { useState} from "react";
import { Link } from "react-router-dom";

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
            console.log("dados do login: ", data);

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

    return (
        <main className="auth-page">
            <title>Entrar | Central de suporte</title>
            <section className="auth-panel" aria-labelledby="login-title">
                <div className="auth-brand-mark" aria-hidden="true">C</div>
                <span className="page-eyebrow">Central de suporte</span>
                <h1 id="login-title">Boas-vindas</h1>
                <p className="auth-intro">Entre na sua conta para acompanhar suas solicitações.</p>

                <form className="page-form" onSubmit={handleSubmit}>
                    {erro && <div className="page-alert page-alert-error" role="alert">{erro}</div>}
                    <div className="page-field">
                        <label htmlFor="email">E-mail</label>
                        <input
                            className="form-control"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="voce@exemplo.com"
                            autoComplete="email"
                            value={inputEmailUser}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputEmailUser(e.target.value)}
                            required
                        />
                    </div>
                    <div className="page-field">
                        <label htmlFor="senha">Senha</label>
                        <input
                            className="form-control"
                            type="password"
                            id="senha"
                            name="password"
                            placeholder="Digite sua senha"
                            autoComplete="current-password"
                            value={inputSenha}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputSenha(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="page-button page-button-primary">
                        Entrar na plataforma
                        <span aria-hidden="true">→</span>
                    </button>
                </form>
                <p className="auth-footnote">Acesso seguro à sua central de atendimento.</p>
                <p className="auth-switch-link">
                    Ainda não tem uma conta? <Link to="/register">Criar conta</Link>
                </p>
            </section>
        </main>
    )
}

export default LoginPage;