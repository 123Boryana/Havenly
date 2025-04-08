import {useState, useEffect} from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import ProfileUpload from "../../components/forms/ProfileUpload";

export default function Profile() {
    //context
    const [auth, setAuth] = useAuth();
    //state
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [about, setAbout] = useState("");
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);
    //hook
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.user) {
            setUsername(auth.user?.username);
            setName(auth.user?.name);
            setEmail(auth.user?.email);
            setCompany(auth.user?.company);
            setAddress(auth.user?.address);
            setPhone(auth.user?.phone);
            setAbout(auth.user?.about);
            setPhoto(auth.user?.photo);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            setLoading(true);
            const {data} = await axios.put("/update-profile", {
                username,
                name,
                email,
                company,
                address,
                phone,
                about,
                photo,
            });
            if(data?.error){
                toast.error(data.error)
            } else {
                setAuth({...auth, user: data})

                let fromLS = JSON.parse(localStorage.getItem("auth"));
                fromLS.user = data;
                localStorage.setItem("auth", JSON.stringify(fromLS));
                setLoading(false);
                toast.success("Профилът е успешно променен.");
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <h1 className="display-1 bg-primary text-light p-5">Профил</h1>
        
            <div className="container-fluid">
                <div className="container mt-2">

                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 mt-2">

                            <ProfileUpload 
                                photo={photo} 
                                setPhoto={setPhoto} 
                                uploading={uploading} 
                                setUploading={setUploading}
                            />

                            <form onSubmit={handleSubmit}>
                                <input type="text" 
                                placeholder="Наименование" 
                                className="form-control mb-4"
                                value={username}
                                onChange={e => 
                                setUsername(slugify((e).target.value.toLowerCase()))
                                }/>
                                <input type="text" 
                                placeholder="Име" 
                                className="form-control mb-4"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                />
                                 <input type="text" 
                                className="form-control mb-4"
                                value={email}
                                disabled={true}
                                />
                                <input type="text" 
                                placeholder="Компания" 
                                className="form-control mb-4"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                />
                                <input type="text" 
                                placeholder="Адрес" 
                                className="form-control mb-4"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                />
                                <input type="text" 
                                placeholder="Телефонен номер" 
                                className="form-control mb-4"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                />
                                <textarea
                                placeholder="Напиши нещо за себе си..." 
                                className="form-control mb-4"
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                maxLength={200}
                                />
                                <button 
                                    className="btn btn-primary col-12 mb-4"
                                    disabled={loading}
                                >
                                    {loading ? "Зареждане" : "Запази промените"}
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