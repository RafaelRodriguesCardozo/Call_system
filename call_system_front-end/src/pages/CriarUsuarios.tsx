import { useState} from "react";


interface adminPageProps {
    role: string;
}

function CriarUsuarios({role}: adminPageProps ){

    // Criar um usuário
    const [inputUser, setInputUser] = useState('');
    const [inputEmailUser, setInputEmailUser] = useState('');
    const [inputSenha, setInputSenha] = useState('');
    const [inputRole, setInputRole] = useState(role);

    // Ao executar cria um usuário
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{

            const token = localStorage.getItem('token');

            const response = await fetch(`https://callsystem-production.up.railway.app/register`, {
                method: 'POST',
                headers: {
                    'content-type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify({
                    usernome : inputUser,
                    useremail : inputEmailUser,
                    userpassword_hash : inputSenha,
                    role : inputRole
                })

            });

            const data = await response.json();

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
        <div className="page-container">
            <header className="page-heading">
                <span className="page-eyebrow">Administração</span>
                <h1>Criar usuário</h1>
                <p>Cadastre uma nova pessoa e configure o nível de acesso à plataforma.</p>
            </header>
            <section className="page-card page-form-card" aria-labelledby="create-user-title">
                <div className="page-card-heading">
                    <div>
                        <h2 id="create-user-title">Dados da conta</h2>
                        <p>Preencha as informações para criar o acesso.</p>
                    </div>
                    <span className="page-card-icon" aria-hidden="true">＋</span>
                </div>
                <form className="page-form" onSubmit={handleSubmit}>
                    <div className="page-field">
                        <label htmlFor="nome">Nome de usuário</label>
                        <input
                            className="form-control"
                            type="text"
                            id="nome"
                            name="name"
                            placeholder="Nome completo"
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
                            placeholder="usuario@exemplo.com"
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
                            placeholder="Defina uma senha"
                            autoComplete="new-password"
                            value={inputSenha}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputSenha(e.target.value)}
                            required
                        />
                    </div>
                    <div className="page-field">
                        <label htmlFor="user-role">Perfil de acesso</label>
                        <select
                            id="user-role"
                            name="role"
                            className="form-select"
                            value={inputRole}
                            onChange={(e) => setInputRole(e.target.value)}
                        >
                            <option value="CLIENTE">Cliente</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                        <small>Administradores podem gerenciar chamados e usuários.</small>
                    </div>
                    <div className="page-form-actions">
                        <button type="submit" className="page-button page-button-primary">Criar usuário <span aria-hidden="true">→</span></button>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default CriarUsuarios;