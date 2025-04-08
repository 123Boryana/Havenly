import { IoBedOutline } from "react-icons/io5";
import { TbBath } from "react-icons/tb";
import { BiArea } from "react-icons/bi";

export default function AdFeatures({ ad }) {
  return (
    <p className="card-text ad-features-container d-flex justify-content-between">
      {ad?.bedrooms ? (
        <span className="d-flex align-items-center">
          <IoBedOutline /> {ad?.bedrooms}
        </span>
      ) : (
        ""
      )}

      {ad?.bathrooms ? (
        <span className="d-flex align-items-center">
          <TbBath /> {ad?.bathrooms}
        </span>
      ) : (
        ""
      )}

      {ad?.landsize ? (
        <span className="d-flex align-items-center">
          <BiArea /> {ad?.landsize}
        </span>
      ) : (
        ""
      )}
    </p>
  );
}
