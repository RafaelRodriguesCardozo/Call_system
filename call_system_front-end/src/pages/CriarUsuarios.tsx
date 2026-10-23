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
        <main className="module-card">
            <header className="page-heading">
                <span className="eyebrow">Administração</span>
                <h1>Criar usuário</h1>
                <p>Cadastre uma pessoa e defina se ela terá acesso de cliente ou administrador.</p>
            </header>
            <form onSubmit={handleSubmit} className="form-stack">
                <div className="field">
                    <div>
                        <label htmlFor="nome">Nome de usuário</label>
                        <input
                            className="text-input"
                            type="text" 
                            id="nome" 
                            placeholder="Ex.: Maria Silva"
                            value={inputUser}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputUser(e.target.value)}    
                        />
                    </div>
                </div>
                <div className="field">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            className="text-input"
                            type="email" 
                            id="email" 
                            placeholder="nome@email.com"
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
                            placeholder="Defina uma senha"
                            value={inputSenha}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputSenha(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="field">
                    <div>
                        <label htmlFor="role">Tipo de acesso</label>
                        <select
                            className="text-input"
                            id="role"
                            value={inputRole}
                            onChange={(e) => setInputRole(e.target.value)}
                        >
                            <option value="CLIENTE">CLIENTE</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                </div>

                <button type="submit" className="button button-primary">Criar usuário</button>
            </form>
        </main>
    )
}

export default CriarUsuarios;