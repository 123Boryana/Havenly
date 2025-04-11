import { useSearch } from "../../context/search";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { GOOGLE_PLACES_KEY } from "../../config";
import { sellPrices, rentPrices } from "../../helpers/priceList";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SearchForm() {
  // context
  const [search, setSearch] = useSearch();

  const navigate = useNavigate();

  const handleSearch = async () => {
    setSearch({ ...search, loading: false });
    try {
      const { results, page, price, ...rest } = search;
      const query = queryString.stringify(rest);

      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/search?${query}`);

      if (search?.page !== "/search") {
        setSearch((prev) => ({ ...prev, results: data, loading: false }));
        navigate("/search");
      } else {
        setSearch((prev) => ({
          ...prev,
          results: data,
          page: window.location.pathname,
          loading: false,
        }));
      }
    } catch (err) {
      console.log(err);
      setSearch({ ...search, loading: false });
    }
  };

  const clearFilters = () => {
    setSearch({
      address: "",
      action: "Buy",
      type: "House",
      price: "",
      priceRange: null,
      loading: false,
    });
  };

  return (
    <div className="container mt-2 mb-5">
      {/* Address Search */}
      <div className="row">
        <div className="col-lg-12 form-control">
          <GooglePlacesAutocomplete
            apiKey={GOOGLE_PLACES_KEY}
            apiOptions="bg"
            selectProps={{
              defaultInputValue: search?.address,
              placeholder: "Потърсете адрес...",
              onChange: ({ value }) =>
                setSearch({ ...search, address: value.description }),
            }}
          />
        </div>
      </div>

      {/* Action and Type Buttons */}
      <div className="d-flex justify-content-center mt-3 gap-2">
        {/* Action Buttons */}
        <button
          onClick={() => setSearch({ ...search, action: "Buy", price: "" })}
          className={`btn ${
            search.action === "Buy" ? "btn-success" : "btn-outline-success"
          } col-lg-2 mr-1`}
        >
          {search.action === "Buy" ? "Купуване" : "Купуване"}
        </button>

        <button
          onClick={() => setSearch({ ...search, action: "Rent", price: "" })}
          className={`btn ${
            search.action === "Rent" ? "btn-success" : "btn-outline-success"
          } col-lg-2 mr-1`}
        >
          {search.action === "Rent" ? "Под наем" : "Под наем"}
        </button>

        {/* Type Buttons */}
        <button
          onClick={() => setSearch({ ...search, type: "House", price: "" })}
          className={`btn ${
            search.type === "House" ? "btn-primary" : "btn-outline-primary"
          } col-lg-2 mr-1`}
        >
          {search.type === "House" ? "Къща" : "Къща"}
        </button>

        <button
          onClick={() => setSearch({ ...search, type: "Land", price: "" })}
          className={`btn ${
            search.type === "Land" ? "btn-primary" : "btn-outline-primary"
          } col-lg-2 mr-1`}
        >
          {search.type === "Land" ? "Земя" : "Земя"}
        </button>

        {/* Price Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-warning dropdown-toggle mr-1"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            &nbsp; {search?.price ? search.price : "Цена"}
          </button>
          <ul className="dropdown-menu">
            {search.action === "Buy" ? (
              <>
                {sellPrices?.map((p) => (
                  <li key={p._id}>
                    <a
                      className="dropdown-item"
                      onClick={() =>
                        setSearch({
                          ...search,
                          price: p.name,
                          priceRange: p.array,
                        })
                      }
                    >
                      {p.name}
                    </a>
                  </li>
                ))}
              </>
            ) : (
              <>
                {rentPrices?.map((p) => (
                  <li key={p._id}>
                    <a
                      className="dropdown-item"
                      onClick={() =>
                        setSearch({
                          ...search,
                          price: p.name,
                          priceRange: p.array,
                        })
                      }
                    >
                      {p.name}
                    </a>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>

        {/* Search Button */}
        <button onClick={handleSearch} className="btn btn-danger col-lg-2 mr-1">
          Потърси
        </button>

        {/* Clear Button */}
        <button onClick={clearFilters} className="btn btn-primary col-lg-2 mr-1">
          Изчисти
        </button>
      </div>
    </div>
  );
}
