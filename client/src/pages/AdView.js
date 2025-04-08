import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ImageGallery from "../components/misc/ImageGallery";
import Logo from "../logo.svg";
import AdFeatures from "../components/cards/AdFeatures";
import { formatNumber } from "../helpers/ad.js";
import dayjs from "dayjs";
import LikeUnlike from "../components/misc/LikeUnlike.js";
import MapCard from "../components/cards/MapCard.js";
import AdCard from "../components/cards/AdCard.js";
import ContactSeller from "../components/forms/ContactSeller.js";

import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);

export default function AdView() {
  const [ad, setAd] = useState({});
  const [related, setRelated] = useState([]);
  const params = useParams();

  useEffect(() => {
    if (params?.slug) fetchAd();
  }, [params?.slug]);

  const fetchAd = async () => {
    try {
      const { data } = await axios.get(`/ad/${params.slug}`);
      console.log(data); // Log the full response to check its structure
      setAd(data?.ad);
      setRelated(data?.related); // Ensure 'related' is being set
    } catch (err) {
      console.log(err);
    }
  };

  const generatePhotosArray = (photos) => {
    const defaultWidth = 4; // Set a fixed width
    const defaultHeight = 3; // Set a fixed height
  
    if (photos?.length > 0) {
      return photos.map((p) => ({
        src: p,
        width: defaultWidth,
        height: defaultHeight,
      }));
    } else {
      return [
        {
          src: Logo,
          width: 2,
          height: 1,
        },
      ];
    }
  };

  return (
    <>
      <div className="container-fluid px-0">
        <ImageGallery photos={generatePhotosArray(ad?.photos)} />
      </div>

      <div className="container mt-4">
        <div className="row">
          {/* Left Side */}
          <div className="col-md-4">
            <div className="d-flex justify-content-right align-items-center">
              <h1 className="mr-2">{ad?.title}</h1>
              <LikeUnlike ad={ad} />
            </div>
            <div className="d-flex justify-content-right align-items-center mt-2">
              <h3>${formatNumber(ad?.price)}</h3>
            </div>
            <AdFeatures ad={ad} />
            {ad?.sold ? "❌ Off market" : "✅ In market"}

            <div className="mt-4">
              <h3 className="fw-bold">Description</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: ad?.description?.replaceAll(".", "<br/>") || "",
                }}
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="col-md-8">
            <div className="container mt-4">
              <MapCard ad={ad} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4 text-center">
        <button
          className="btn btn-primary mb-5"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#contactForm"
          aria-expanded="false"
          aria-controls="contactForm"
        >
          Свържи се
        </button>
        <div className="collapse mt-3" id="contactForm">
          <ContactSeller ad={ad} />
        </div>
      </div>

      <div className="container-fluid">
        <h4 className="text-center mb-3">Подобни имоти</h4>
        <hr style={{ width: "100%" }} />
        <div className="row">
          {related && related.length > 0 ? (
            related.map((ad) => <AdCard key={ad._id} ad={ad} />)
          ) : (
            <p className="text-center">No related properties found.</p>
          )}
        </div>
      </div>
    </>
  );
}