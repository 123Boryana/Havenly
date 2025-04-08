import {useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";



export default function Settings() {
    //state
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            setLoading(true);
            const {data} = await axios.put("/update-password", {
                password,
            });
            if(data?.error){
                toast.error(data.error)
                setLoading(false);
            } else {
                setLoading(false);
                toast.success("Паролата беше променена.");
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="display-1 bg-primary text-light p-5">Настройки</h1>
        
            <div className="container-fluid">
                <div className="container mt-2">

                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 mt-2">

                            <form onSubmit={handleSubmit}>
                         
                                <input type="password" 
                                placeholder="Парола" 
                                className="form-control mb-4"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                                <button 
                                    className="btn btn-primary col-12 mb-4"
                                    disabled={loading}
                                >
                                    {loading ? "Зареждане" : "Променете паролата"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* <pre>{JSON.stringify()}
                    </pre> */}
                </div>
            </div>
        </>
    );
}