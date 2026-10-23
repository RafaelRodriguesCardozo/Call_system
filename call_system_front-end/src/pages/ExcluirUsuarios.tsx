import { useState, useEffect} from "react";

interface USER {
    USERID: number;
    USERNOME: string;
    USEREMAIL: string;
    ROLE: string;
}

interface adminPageProps {
    role: string;
}

function ExcluirUsuarios({role}: adminPageProps ){
    const [listaUser, setListaUser] = useState<USER[]>([]);
    const [erro, setErro] = useState('');

    // Dá a opção de deletar um ou mais usuários específicos quando se tem o cadastro de administrador
    const deleteUser = async (id: number, nome: string) =>{
        if (!window.confirm(`Deseja realmente deletar o Usuário: "${nome}" (ID #${id})?`)) {
            return;
        }

        const token = localStorage.getItem('token');

        try{
            const response = await fetch(`https://callsystem-production.up.railway.app/register/${id}`, {
                method: 'DELETE',
                headers: {
                    'content-type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
            })
        
            const data = await response.json();
    
            if(response.ok){
                alert('Usuário deletado com sucesso!');
                console.log(data.dados);
                setListaUser(listaUser.filter(user => user.USERID !== id));
            }
        }catch{
            console.log(Error || 'Ocorreu um erro ao se conectar com o banco de dados');
        }
    }

    // Renderia a lista de usuários
    useEffect (() => {
        const userList = async () => {
            try{

                const token = localStorage.getItem('token');

                const response = await fetch(`https://callsystem-production.up.railway.app/register`, {
                    method: 'GET',
                    headers: {
                        'content-type' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    },
                });

                const data = await response.json();

                if(response.ok){
                    setListaUser(data.dados);
                }else{
                    setErro(data.Erro || 'ocorreu um erro ao listar os usuários')
                }

            }catch(err){
                console.log('ocorreu um erro ao listar users', err);
                setErro('Não foi possível conectar ao servidor.');
            }
        }
            userList();
        }, 
    []);


    return (
        <main className="module-card">
            {/* Seção de exclusão de usuário */}
            <header className="page-heading">
                <span className="eyebrow">Administração</span>
                <h1>Gerenciar usuários</h1>
                <p>Consulte as contas cadastradas e remova um usuário quando necessário.</p>
            </header>

                {/* Se houver erro ao carregar os usuários ele renderiza o alerta, se não mostra o texto informativo */}
                {erro === "Não foi possível conectar ao servidor." ? (
                    <div>{erro && <div className="feedback feedback-error" role="alert">{erro}</div>}</div>
                ) : (<p className="permission-note">Somente o perfil {role} pode excluir usuários.</p>)}
                
                {/* Renderiza todos os usuários criados */}
                <ul className="user-list">
                    {listaUser.map((user) => (
                        <li key={user.USERID} className="user-card">
                            <div className="user-details">
                                <strong>{user.USERNOME}</strong>
                                <span className="status-pill status-neutral">{user.ROLE}</span>
                                <span>{user.USEREMAIL}</span>
                            </div>
                            <button onClick={() => deleteUser(user.USERID, user.USERNOME)} className="button button-danger">Excluir</button>
                        </li>
                    ))}
                </ul>
        </main>

    )
}

export default ExcluirUsuarios;