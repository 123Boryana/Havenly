import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function ContactSeller({ad}) {
    //context
    const [auth, setAuth] = useAuth();
    //state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState("");

    const loggedIn = auth.user !== null && auth.token !== "";

    useEffect(() => {
        if(loggedIn) {
            setName(auth?.user?.name);
            setEmail(auth?.user?.email);
            setPhone(auth?.user?.phone);
        }
    }, [loggedIn])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contact-seller`, {
                name,
                email,
                message,
                phone,
                adId: ad._id,
            });
            if(data?.error) {
                toast.error(data?.error);
                setLoading(false);
            } else {
                setLoading(false);
                toast.success("Запитването е направено.");
                setMessage("");
            }
        } catch (err) {
            console.log(err);
            toast.error("Нещо се обърка. Опитай отново.");
            setLoading(false);
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <h3>
                        Свържи се с {" "} 
                        {ad?.postedBy?.name ? ad?.postedBy?.name : ad?.postedBy?.username}
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <textarea 
                            name="message" 
                            className="form-control mb-3" 
                            placeholder="Съобщение"
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)}
                            autoFocus={true}
                            disabled={!loggedIn}
                            ></textarea>
                        <input 
                            type="text"
                            className="form-control mb-3"
                            placeholder="Име"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!loggedIn}
                        />
                        <input 
                            type="text"
                            className="form-control mb-3"
                            placeholder="Имейл"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!loggedIn}
                        />
                        <input 
                            type="text"
                            className="form-control mb-3"
                            placeholder="Телефонен номер"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={!loggedIn}
                        />

                        <button className="btn btn-primary mt-4 mb-5" disabled={!name || !email || loading}>
                            {loggedIn ? loading ? "Моля изчакайте" : "Изпратете запитване" : "Влезте в акаунта си"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}