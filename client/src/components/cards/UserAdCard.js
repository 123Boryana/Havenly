import { Badge } from "antd";
import { Link } from "react-router-dom";
import AdFeatures from "../../components/cards/AdFeatures";
import { formatNumber } from "../../helpers/ad";

export default function UserAdCard({ ad }) {
  return (
    <div className="col-lg-4 p-4 gx-4 gy-4">
      <Link to={`/user/ad/${ad.slug}`}>
        <Badge.Ribbon
          text={`${ad?.type === "House" ? "Къща" : "Земя"} ${ad?.action === "Sell" ? "за продажба" : "под наем" }`}
          color={`${ad?.action === "Sell" ? "blue" : "red"}`}
        >
          <div className="card hoverable shadow">
            <img
              src={ad?.photos?.[0]}
              alt={`${ad?.type}-${ad?.address}-${ad?.action}-${ad?.price}`}
              style={{ height: "250px", objectFit: "cover" }}
            />

            <div className="card-body">
              <h3>${formatNumber(ad?.price)}</h3>
              <p className="card-text">{ad?.address}</p>

              <AdFeatures ad={ad} />
            </div>
          </div>
        </Badge.Ribbon>
      </Link>
    </div>
  );
}