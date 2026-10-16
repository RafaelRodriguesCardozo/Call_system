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

    const apiUrl = "https://callsystem-production.up.railway.app:3036";
    //const localApi = "http://localhost";

    // Dá a opção de deletar um ou mais usuários específicos quando se tem o cadastro de administrador
    const deleteUser = async (id: number, nome: string) =>{
        if (!window.confirm(`Deseja realmente deletar o Usuário: "${nome}" (ID #${id})?`)) {
            return;
        }

        const token = localStorage.getItem('token');

        try{
            const response = await fetch(`${apiUrl}/register/${id}`, {
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

                const response = await fetch(`${apiUrl}/register`, {
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
        <div className="mt-5">
            {/* Seção de exclusão de usuário */}
            <div>

                {/* Se houver erro ao carregar os usuários ele renderiza o alerta, se não mostra o texto informativo */}
                {erro === "Não foi possível conectar ao servidor." ? (
                    <div>{erro && <div className="alert alert-danger text-center">{erro}</div>}</div>
                ) : (<div><h5 className="text-info p-2 text-center">somente o {role} pode excluir um usuário</h5></div>)}
                
                {/* Renderiza todos os usuários criados */}
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
        </div>

    )
}

export default ExcluirUsuarios;