import { useState} from "react";
import { Link } from "react-router-dom";

function RegisterPage(){
    
    const [inputUser, setInputUser] = useState('');
    const [inputEmailUser, setInputEmailUser] = useState('');
    const [inputSenha, setInputSenha] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{

            const token = localStorage.getItem('token')

            const response = await fetch(`https://callsystem-production.up.railway.app/register`, {
                method: 'POST',
                headers: {
                    'content-type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify({
                    usernome : inputUser,
                    useremail : inputEmailUser,
                    userpassword_hash : inputSenha
                })

            });

            const data = await response.json()

            if(response.ok){
                alert(data.mensagem || `Usuário registrado com sucesso!.`);
                console.log(data);
            }else{
                alert(data.Erro || `Ocorreu um erro ao registrar-se.`);
            }
        }
        catch(err){
            console.log('ocorreu um erro ao conectar com banco de dados', err);
        }
    }

    return (
        <main className="auth-page">
            <title>Criar conta | Central de suporte</title>
            <section className="auth-panel" aria-labelledby="register-title">
                <div className="auth-brand-mark" aria-hidden="true">C</div>
                <span className="page-eyebrow">Central de suporte</span>
                <h1 id="register-title">Crie sua conta</h1>
                <p className="auth-intro">Cadastre-se para acessar o suporte e acompanhar seus chamados.</p>

                <form className="page-form" onSubmit={handleSubmit}>
                    <div className="page-field">
                        <label htmlFor="nome">Nome de usuário</label>
                        <input
                            className="form-control"
                            type="text"
                            id="nome"
                            name="name"
                            placeholder="Como podemos chamar você?"
                            autoComplete="name"
                            value={inputUser}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputUser(e.target.value)}
                            required
                        />
                    </div>
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
                            placeholder="Crie uma senha"
                            autoComplete="new-password"
                            value={inputSenha}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputSenha(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="page-button page-button-primary">
                        Criar minha conta
                        <span aria-hidden="true">→</span>
                    </button>
                </form>
                <p className="auth-footnote">Preencha os dados para concluir o cadastro.</p>
                <p className="auth-switch-link">
                    Já possui uma conta? <Link to="/login">Entrar</Link>
                </p>
            </section>
        </main>
    )
}

export default RegisterPage;