import {useAuth} from "../../context/auth";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function LikeUnlike({ad}) {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    const handleLike = async () => {
        try{
            if(auth.user === null) {
                navigate("/login", {
                    state: `/ad/${ad.slug}`,
                });
                return;
            }
            const {data} = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/wishlist`, {adId: ad._id});
            console.log("handle like =>", data);
            setAuth({...auth, user: data});
            const fromLS = JSON.parse(localStorage.getItem("auth"));
            fromLS.user = data;
            localStorage.setItem("auth", JSON.stringify(fromLS));
            toast.success("Добавено в листа с харесани");
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnlike = async () => {
        try{
            if(auth.user === null) {
                navigate("/login", {
                    state: `/ad/${ad.slug}`,
                });
                return;
            }
            const {data} = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/wishlist/${ad._id}`);
            console.log("handle unlike =>", data);
            setAuth({...auth, user: data});
            const fromLS = JSON.parse(localStorage.getItem("auth"));
            fromLS.user = data;
            localStorage.setItem("auth", JSON.stringify(fromLS));
            toast.success("Премахнато от харесванията");
        } catch (err) {
            console.log(err);
        }
    };
    
    return (<>
        {auth.user?.wishlist?.includes(ad._id) ? (
            <span>
                <FcLike onClick={handleUnlike} className="h2 pointer" />
            </span>
        ) : (
            <span>
                <FcLikePlaceholder onClick={handleLike} className="h2 pointer"/>
            </span>
        )}
    </>
    );
}