import { useState} from "react";

function RegisterPage(){
    
    const [inputUser, setInputUser] = useState('');
    const [inputEmailUser, setInputEmailUser] = useState('');
    const [inputSenha, setInputSenha] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{
            
            const response = await fetch('http://localhost:3036/user', {
                method: 'POST',
                headers: {'content-type' : 'application/json'},
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

    return(
        <div className="container mt-5">
            <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3 d-flex justify-content-center">
                    <div className="form-floating col-sm-5">
                        <input
                            className="form-control form-control-sm"
                            type="text" 
                            id="nome" 
                            placeholder="ex: usuario1"
                            value={inputUser}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputUser(e.target.value)}    
                        />
                        <label htmlFor="nome">Nome de Usuário</label>
                    </div>
                </div>
                <div className="row g-3 mb-3 d-flex justify-content-center">
                    <div className="form-floating col-sm-5">
                        <input
                            className="form-control form-control-sm"
                            type="email" 
                            id="email" 
                            placeholder="ex: 123@gmail.com"
                            value={inputEmailUser}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputEmailUser(e.target.value)}    
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                </div>
                <div className="row g-3 mb-3 d-flex justify-content-center">
                    <div className="form-floating col-sm-5">
                        <input
                            className="form-control form-control-sm"
                            type="password"
                            id="senha"
                            placeholder="ex: 12345"
                            value={inputSenha}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputSenha(e.target.value)}
                        />
                        <label htmlFor="senha" className="float">Senha</label>
                    </div>
                </div>
                <div className="row g-3 d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary col-sm-3">Criar usuário</button>
                </div>
            </form>

        </div>
    )
}

export default RegisterPage;