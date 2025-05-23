import { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { GOOGLE_PLACES_KEY } from "../../../config";
import CurrencyInput from "react-currency-input-field";
import ImageUpload from "../../../components/forms/ImageUpload";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";

export default function AdEdit({ action, type }) {
  // state
  const [ad, setAd] = useState({
    photos: [],
    uploading: false,
    price: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    carpark: "",
    landsize: "",
    title: "",
    description: "",
    loading: false,
    type,
    action,
  });

  const [loaded, setLoaded] = useState(false);

  //hooks
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if(params?.slug) {
       fetchAd();  
    }
  }, [params?.slug]);

  const fetchAd = async () => {
    try{
        const {data} = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/ad/${params.slug}`);
        //console.log("single ad edit page =>", data);
        setAd(data?.ad);
        setLoaded(true);
    } catch (err) {
        console.log(err);
    }
  };

  const handleClick = async () => {
    try {
      //validation
        if(!ad.photos?.length) {
            toast.error("Photo is required");
            return;
        } else if(!ad.price) {
            toast.error("Price is required");
            return;
        } else if(!ad.description) {
            toast.error("Description is required");
            return;
        } else {
            //make API put request
            setAd({...ad, loading: true});

            const {data} = await axios.put(`/ad/${ad._id}`, ad);
            //console.log("ad create response =>", data);
            if(data.error) {
              toast.error(data.error)
              setAd({...ad, loading: false});
            } else {
              toast.success("Ad updated successfully");
              setAd({...ad, loading: false});
              navigate("/dashboard");
            }
        }

    } catch (err) {
      console.log(err);
      setAd({...ad, loading: false});
    }
  };
  
  const handleDelete = async () => {
    try {
        //make API put request
        setAd({...ad, loading: true});

        const {data} = await axios.delete(`/ad/${ad._id}`);
        //console.log("ad create response =>", data);
        if(data.error) {
          toast.error(data.error)
          setAd({...ad, loading: false});
        } else {
          toast.success("Ad deleted successfully");
          setAd({...ad, loading: false});
          navigate("/dashboard");
        }
    } catch (err) {
      console.log(err);
      setAd({...ad, loading: false});
    }
  };

  return (
    <div>
        <h1 className="display-1 bg-primary text-light p-5">Промени обявата</h1>
    <div className="container">
      <div className="mb-3 form-control">
        <ImageUpload ad={ad} setAd={setAd} />
       { loaded ?  (<GooglePlacesAutocomplete
          apiKey={GOOGLE_PLACES_KEY}
          apiOptions="au"
          selectProps={{
            defaultInputValue: ad?.address,
            placeholder: "Потърсете адрес..",
            onChange: ({ value }) => {
              setAd({ ...ad, address: value.description });
            },
          }}
        />) : ("")}
      </div>

      { loaded ? (<div style={{marginTop: "80px"}}>
      <CurrencyInput
        placeholder="Цена"
        defaultValue={ad.price}
        className="form-control mb-3"
        onValueChange={(value) => setAd({ ...ad, price: value })}
      />
      </div>) : ("")}
      
          {ad.type === "House" ? (
            <>
             <input
        type="number"
        min="0"
        className="form-control mb-3"
        placeholder="Задайте брой спални"
        value={ad.bedrooms}
        onChange={(e) => setAd({ ...ad, bedrooms: e.target.value })}
      />

      <input
        type="number"
        min="0"
        className="form-control mb-3"
        placeholder="Задайте брой бани"
        value={ad.bathrooms}
        onChange={(e) => setAd({ ...ad, bathrooms: e.target.value })}
      />

      <input
        type="number"
        min="0"
        className="form-control mb-3"
        placeholder="Задайте брой паркоместа"
        value={ad.carpark}
        onChange={(e) => setAd({ ...ad, carpark: e.target.value })}
      />
      </>
          ) : ("")}

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Задайте Квадратура"
        value={ad.landsize}
        onChange={(e) => setAd({ ...ad, landsize: e.target.value })}
      />

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Заглавие"
        value={ad.title}
        onChange={(e) => setAd({ ...ad, title: e.target.value })}
      />

      <textarea
        className="form-control mb-3"
        placeholder="Въведете описание"
        value={ad.description}
        onChange={(e) => setAd({ ...ad, description: e.target.value })}
      />

    <div className="d-flex justify-content-between">

    <button onClick={handleClick} className={`btn btn-primary mb-5 ${ad.loading ? "disabled" : ""}`}>
        {ad.loading ? "Запазване..." : "Предай"}
      </button>

      <button onClick={handleDelete} className={`btn btn-danger mb-5 ${ad.loading ? "disabled" : ""}`}>
        {ad.loading ? "Изтриване..." : "Изтрий"}
      </button>
    </div>

      {/*<pre>{JSON.stringify(ad, null, 4)}</pre>*/}
      </div>
    </div>
  );
}