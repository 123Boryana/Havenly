import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import AdCard from "../../components/cards/AdCard";

export default function Wishlist() {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAds();
  }, [auth.token !== ""]);

  const fetchAds = async () => {
    try {
      const { data } = await axios.get(`/wishlist`);
      setAds(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Списък с желания</h1>

      {!ads?.length ? (
        <div
          className="d-flex justify-content-center align-items-center vh-100"
          style={{ marginTop: "-10%" }}
        >
          <h2>
            Здравей, {auth.user?.name ? auth.user?.name : auth.user?.username}. Нямате харесани публикации.
          </h2>
        </div>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 mt-4 mb-4">
              <p className="text-center">
                Харесали сте {ads?.length} публикации.
              </p>
            </div>
          </div>

          <div className="row">
            {ads?.map((ad) => (
              <AdCard ad={ad} key={ad._id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}