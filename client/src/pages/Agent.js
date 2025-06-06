import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import UserCard from "../components/cards/UserCard";
import AdCard from "../components/cards/AdCard";
import Banner from "../components/banner/Banner";
import bannerPhoto from "../images/Realestate-Tips.webp";

export default function Agent() {
    //state
    const [agent, setAgent] = useState(null);
    const [ads, setAds] = useState([]);
    const [loading,setLoading] = useState(true);

    const params = useParams();
    //console.log(params.username);

    useEffect(() => {
        if(params?.username) fetchAgent();
    }, [params?.username]);

    const fetchAgent = async () => {
        try{
            const {data} = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/agent/${params.username}`);
            setAgent(data.user);
            setAds(data.ads);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    if(loading) {
        return (
            <div 
            className="d-flex justify-content-center align-items-center vh-100" 
            style={{marginTop: "-10%"}}>
                <div className="display-1">Зареждане...</div>
            </div>
        );
    }

    return (
        <div>
            <Banner
                imageUrl={bannerPhoto}
                title={agent?.name ?? agent?.username}W
            />

            <div className="container">
                <div className="row">
                    <div className="col-lg-4"></div>
                    <UserCard user={agent}/>
                    <div className="col-lg-4"></div>
                </div>
            </div>

            <h2 className="text-center m-5">Скорошни обяви</h2>

            <div className="container">
                <div className="row">
                    {ads?.map(ad => <AdCard ad={ad} key={ad._id} />)}
                </div>
            </div>
        </div>
    );
}