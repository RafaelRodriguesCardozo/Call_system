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
        <div className="page-container">
            <header className="page-heading">
                <span className="page-eyebrow">Administração</span>
                <h1>Usuários</h1>
                <p>Consulte as contas cadastradas e remova acessos quando necessário.</p>
            </header>

            {erro ? (
                <div className="page-alert page-alert-error" role="alert">{erro}</div>
            ) : (
                <p className="page-permission-note">
                    <span aria-hidden="true">盾</span>
                    Ação restrita ao perfil <strong>{role}</strong>
                </p>
            )}

            {listaUser.length === 0 && !erro ? (
                <div className="page-state">
                    <span className="page-state-icon" aria-hidden="true">♙</span>
                    <strong>Nenhum usuário encontrado</strong>
                    <span>Os usuários cadastrados serão exibidos nesta lista.</span>
                </div>
            ) : (
                <section className="user-list" aria-label="Usuários cadastrados">
                    {listaUser.map((user) => (
                        <article key={user.USERID} className="user-card">
                            <span className="user-avatar" aria-hidden="true">
                                {user.USERNOME.charAt(0).toUpperCase()}
                            </span>
                            <div className="user-card-details">
                                <h2>{user.USERNOME}</h2>
                                <p>{user.USEREMAIL}</p>
                                <span className={`user-role${user.ROLE === 'ADMIN' ? ' user-role-admin' : ''}`}>
                                    {user.ROLE === 'ADMIN' ? 'Administrador' : 'Cliente'}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => deleteUser(user.USERID, user.USERNOME)}
                                className="page-button page-button-danger"
                                aria-label={`Excluir usuário ${user.USERNOME}`}
                            >
                                Excluir
                            </button>
                        </article>
                    ))}
                </section>
            )}
        </div>
    )
}

export default ExcluirUsuarios;