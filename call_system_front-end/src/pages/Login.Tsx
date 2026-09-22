import { useState} from "react";

function LoginPage(){

    const [inputEmailUser, setInputEmailUser] = useState('');
    const [inputSenha, setInputSenha] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{
            
            const response = await fetch('http://localhost:3036/login', {
                method: 'POST',
                headers: {'content-type' : 'application/json'},
                body: JSON.stringify({
                    useremail : inputEmailUser,
                    userpassword : inputSenha
                })
            });

            const data = await response.json()

            if(response.ok){
                alert(data.mensagem || `Login bem sucedido!.`);
                console.log(data);
            }else{
                alert(data.Erro || `Ocorreu um erro ao realizar o login.`);
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

export default LoginPage;