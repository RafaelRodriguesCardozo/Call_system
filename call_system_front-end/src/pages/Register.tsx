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
        <div className="container">
            <form onSubmit={handleSubmit} className="mb-3">

                <div className="mt-3">
                    <label htmlFor="nome" className="form-label">Nome de Usuário</label>
                    <input
                        className="form-control"
                        type="text" 
                        id="nome" 
                        placeholder="ex: usuario1"
                        value={inputUser}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputUser(e.target.value)}    
                    />
                </div>
                <div className="mt-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        className="form-control"
                        type="text" 
                        id="email" 
                        placeholder="ex: 123@gmail.com"
                        value={inputEmailUser}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputEmailUser(e.target.value)}    
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="senha" className="">Senha</label>
                    <input
                        className="form-control"
                        type="password"
                        id="senha"
                        placeholder="ex: 12345"
                        value={inputSenha}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputSenha(e.target.value)}
                     />
                </div>
                <button type="submit" className="btn btn-primary">entrar</button>
            </form>

        </div>
    )
}

export default RegisterPage;