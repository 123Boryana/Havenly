import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Banner from "../../components/banner/Banner";
import bannerPhoto from "../../images/door.jpg";
import "../css/Form.css";

export default function Login() {
    //state
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState("");
    //hooks
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //console.log( email, password );
            setLoading(true);
            const {data} = await axios.post(`/forgot-password`, {
                email,
            });
            if(data.error) {
                toast.error(data.error);
                setLoading(false);
            } else {
                toast.success("Моля проверете имейла си.");
                setLoading(false);
                navigate("/");
            }
            console.log(data);
        } catch (err) {
            console.log(err);
            toast.error("Нещо се обърка. Моля опитайте отново.");
            setLoading(false);
        }
};

    return (
        <div>
        <Banner imageUrl={bannerPhoto} title="Забравена парола" />

        
            <div className="form-container">
                <div className="form-wrapper">
                    <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Въведете имейл"
                        className="form-input"
                        required
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        disabled={loading}
                        className="form-button"
                    >
                        {loading ? "Изчакване..." : "Потвърди"}
                    </button>
                    </form>
                    <Link className="form-link" to="/login">
                    Вписване
                    </Link>
                </div>
            </div>
        </div>
    );
};