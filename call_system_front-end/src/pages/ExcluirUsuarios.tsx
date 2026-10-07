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

    // Usestate para gerar a lista de users
    const [listaUser, setListaUser] = useState<USER[]>([]);
    const [erro, setErro] = useState('');

    // Dá a opção de deletar um ou mais usuários específicos quando se tem o cadastro de administrador
    const deleteUser = async (id: number, nome: string) =>{
        if (!window.confirm(`Deseja realmente deletar o Usuário: "${nome}" (ID #${id})?`)) {
            return;
        }

        try{
            const response = await fetch(`https://callsystem-production.up.railway.app/register/${id}`, {
                method: 'DELETE',
                headers: {'content-type' : 'application/json'},
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

                const response = await fetch('https://callsystem-production.up.railway.app/register', {
                    method: 'GET',
                    headers: {'content-type' : 'application/json'},
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
        <div className="mt-5">
            {/* Seção de exclusão de usuário */}
            <div>
                <div>{erro && <div>{erro}</div>}</div>
                {listaUser.map((user) => (
                    <ul key={user.USERID} className="list-group mb-3">
                        <li className="list-group-item text-black d-flex justify-content-between">
                            <div>
                                <div className=" fw-bolder text-uppercase">{user.USERNOME} <small className="badge bg-secondary">{user.ROLE}</small></div>
                                <div>{user.USEREMAIL}</div>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button onClick={() => deleteUser(user.USERID, user.USERNOME)} className="btn btn-danger">Excluir</button>
                            </div>
                        </li>
                    </ul>
                ))}
            </div>
            <div className="d-flex justify-content-center">{role && <p>Não é possivel apagar usuários {role}</p>}</div>
        </div>

    )
}

export default ExcluirUsuarios;