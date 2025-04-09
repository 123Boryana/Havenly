import SearchForm from "../components/forms/SearchForm";
import { useSearch } from "../context/search";
import AdCard from "../components/cards/AdCard";
import { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import axios from "axios";
import bannerPhoto from "../images/handshake-7346772_1280.jpg";
import Banner from "../components/banner/Banner";

export default function Search() {
    const [search, setSearch] = useSearch();
    const [auth, setAuth] = useAuth();
    const [adsForSell, setAdsForSell] = useState();
    const [adsForRent, setAdsForRent] = useState();
  
    useEffect(() => {
      fetchAds();
    }, []);
  
    const fetchAds = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/ads`);
        setAdsForSell(data.adsForSell);
        setAdsForRent(data.adsForRent);
      } catch (err) {
        console.log(err);
      }
    };
  
    return (
      <div>
        <Banner 
                imageUrl={bannerPhoto}
                title="Търсене"
            />
        <SearchForm />
        <div className="container">
          <div className="row">
            {search.results?.length > 0 ? (
              <div className="col-md-12 text-center p-5">Намерени са {search.results?.length} имота.</div>
            ) : (
              <>
                <div className="row">
                  {adsForSell?.map((ad) => (
                    <AdCard ad={ad} key={ad._id} />
                  ))}
                </div>
                <div className="row">
                  {adsForRent?.map((ad) => (
                    <AdCard ad={ad} key={ad._id} />
                  ))}
                </div>
              </>
            )}
  
            <div className="row">
              {search.results?.map((item) => (
                <AdCard ad={item} key={item._id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }