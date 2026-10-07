import { useState} from "react";

export interface Usuario {
    id?: number;
    nome?: string;
    email?: string;
    role?: string; // Deixe opcional ou adicione caso venha do back-end
    [key: string]: unknown; // Permite qualquer outra propriedade extra que venha da API
}

interface LoginPageProps {
    onLoginSuccess: (Usuario:null) => void;
}

function LoginPage({onLoginSuccess}: LoginPageProps){

    const [inputEmailUser, setInputEmailUser] = useState('');
    const [inputSenha, setInputSenha] = useState('');
    const [erro, setErro] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErro('');

        try{
            
            const response = await fetch('https://callsystem-production.up.railway.app/login', {
                method: 'POST',
                headers: {'content-type' : 'application/json'},
                body: JSON.stringify({
                    useremail : inputEmailUser,
                    userpassword : inputSenha
                })
            });

            if(response.status == 429){
                setErro("Você atingiu o número de tentativas de log-in, tente mais tarde...");
                return;
            }

            const data = await response.json()
            console.log("dados do login: ", data);

            if(response.ok){
                alert(data.mensagem || `Login bem sucedido!.`);
                console.log(data);
                onLoginSuccess(data.usuario);
            }else{
                alert(data.Erro || `Ocorreu um erro ao realizar o login.`);
            }
        }
        catch(err){
            console.log('ocorreu um erro ao conectar com banco de dados', err);
        }
    }

    return(
        <div className="container mt-5">
            <title>login</title>
            <form onSubmit={handleSubmit}>
                {erro && <div className="alert alert-danger">{erro}</div>}
                <div className="row g-3 mb-3 d-flex justify-content-center">
                    <div className="form-floating col-sm-5">
                        <input
                            className="form-control"
                            type="text"
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
                            className="form-control"
                            type="password"
                            id="senha"
                            placeholder="ex: 12345"
                            value={inputSenha}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputSenha(e.target.value)}
                        />
                        <label htmlFor="senha">Senha</label>
                    </div>
                </div>
                <div className="row g-3 d-flex justify-content-center mb-3">
                    <button type="submit" className="btn btn-primary col-sm-3">entrar</button>
                </div>
            </form>
        </div>
    )
}

export default LoginPage;