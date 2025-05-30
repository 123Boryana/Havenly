import { useAuth } from "../context/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import AdCard from "../components/cards/AdCard";
import SearchForm from "../components/forms/SearchForm";
import Banner from "../components/banner/Banner";
import bannerPhoto from "../images/handshake-7346772_1280.jpg";
import Testimonials from "../components/forms/Testimonials";


export default function Rent() {
    //context
    const [auth, setAuth] = useAuth();
    //state
    const [ads, setAds] = useState();

    useEffect(() => {
        fetchAds()
    }, [])

    const fetchAds = async () => {
        try{
            const {data} = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/ads-for-rent`);
            setAds(data)
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <Banner 
                imageUrl={bannerPhoto}
                title="Вземете имот под наем"
            />

            <SearchForm />
            <div className="container">
                <div className="row">
                    {ads?.map((ad) => (
                        <AdCard ad={ad} key={ad._id}/>
                    ))}
                </div>
            </div>
            <Testimonials />
        </div>
    );
}