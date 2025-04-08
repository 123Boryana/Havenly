import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdCreate() {
  //state
  const [sell, setSell] = useState(false);
  const [rent, setRent] = useState(false);
  // hooks
  const navigate = useNavigate();

  const handleSell = () => {
    setSell(true);
    setRent(false);
  };

  const handleRent = () => {
    setRent(true);
    setSell(false);
  };

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Създай обява</h1>

      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ marginTop: "-16%" }}
      >
        <div className="col-lg-6">
          <button
            onClick={handleSell}
            className="btn btn -primary btn-lg col-12 p-5"
          >
            <span className="h2">Продай</span>
          </button>
          {sell && (
            <div className="my-1">
              <button
                onClick={() => navigate("/ad/create/sell/House")}
                className="btn btn-secondary p-5 col-6"
              >
                Къща
              </button>
              <button
                onClick={() => navigate("/ad/create/sell/Land")}
                className="btn btn-secondary p-5 col-6"
              >
                Земя
              </button>
            </div>
          )}
        </div>

        <div className="col-lg-6">
          <button
            onClick={handleRent}
            className="btn btn -primary btn-lg col-12 p-5"
          >
            <span className="h2">Под наем</span>
          </button>
          {rent && (
            <div className="my-1">
              <button
                onClick={() => navigate("/ad/create/rent/House")}
                className="btn btn-secondary p-5 col-6"
              >
                Къща
              </button>
              <button
                onClick={() => navigate("/ad/create/rent/Land")}
                className="btn btn-secondary p-5 col-6"
              >
                Земя
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}