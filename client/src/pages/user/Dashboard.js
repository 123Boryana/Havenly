import { useAuth } from "../../context/auth";
import { useState, useEffect } from "react";
import axios from "axios";
import UserAdCard from "../../components/cards/UserAdCard";

export default function Dashboard() {
//context
const [auth, setAuth] = useAuth();
//state
const [ads, setAds] = useState([]);
const [total, setTotal] = useState(0);
const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);

useEffect(() => {
    fetchAds()
}, [auth.token !== ""]);

useEffect(() => {
    if(page ===1) return;
    fetchAds();
}, [page]);

const fetchAds = async () => {
    try {
       const {data} = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user-ads/${page}`);
       setAds([...ads, ...data.ads]);
       setTotal(data.total);
    } catch (err){
        console.log(err);
    }
};

const seller = auth.user?.role?.includes("Seller");

    return (
        <div>
            
            <h1 className="display-1 bg-primary text-light p-5">Моите обяви</h1>
            {!seller ? (
                <div className="d-flex justify-content-center align-items-center vh-100" style={{marginTop: "-20%"}}>
                    <h2>Здравейте, {auth.user?.name ? auth.user?.name : auth.user?.username}! Добре дошли в Havenly.</h2>
                </div>
            ) : (
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 mt-4 mb-4">
                            <p className="text-center">Намерени са {total} обяви.</p>
                        </div>
                    </div>
                    <div className="row">
                            {ads?.map((ad) => <UserAdCard ad={ad} key={ad._id} />)}
                    </div>

                  { ads?.length < total ? (
                    <div className="row">
                        <div className="col text-center mt-4 mb-4">
                            <button 
                                disabled={loading} 
                                className="btn btn-warning" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(page + 1);
                            }}>
                                {loading ? "Зареждане..." : `${ads?.length} / ${total} повече`}
                            </button>
                        </div>
                    </div>
                    ) : ("")}
                </div>
            )}
        </div>
    );
}