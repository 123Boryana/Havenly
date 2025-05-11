import { useSearch } from "../../context/search";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { GOOGLE_PLACES_KEY } from "../../config";
import { sellPrices, rentPrices } from "../../helpers/priceList";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SearchForm() {
  const [search, setSearch] = useSearch();
  const navigate = useNavigate();

  const handleSearch = async () => {
    setSearch({ ...search, loading: true }); // Задай loading: true преди заявката
    try {
      const { results, page, ...rest } = search;
      // Увери се, че priceRange е масив или null
      rest.priceRange = rest.priceRange ? rest.priceRange : null;
      const query = queryString.stringify(rest, { skipNull: true });

      console.log("Search query:", query); // Добави дебъг за заявката
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/search?${query}`
      );

      setSearch((prev) => ({
        ...prev,
        results: data,
        page: "/search",
        loading: false,
      }));
      navigate("/search");
    } catch (err) {
      console.error("Search error:", err.response?.data || err.message);
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
      results: [],
      page: "",
      loading: false,
    });
  };

  return (
    <div className="container mt-2 mb-5">
      <div className="row">
        <div className="col-lg-12 form-control">
          <GooglePlacesAutocomplete
            apiKey={GOOGLE_PLACES_KEY}
            apiOptions={{ language: "bg", region: "BG" }}
            selectProps={{
              defaultInputValue: search?.address || "",
              placeholder: "Потърсете адрес...",
              onChange: ({ value }) =>
                setSearch({ ...search, address: value.description }),
            }}
          />
        </div>
      </div>

      <div className="d-flex justify-content-center mt-3 gap-2">
        <button
          onClick={() => setSearch({ ...search, action: "Buy", price: "", priceRange: null })}
          className={`btn ${search.action === "Buy" ? "btn-success" : "btn-outline-success"} col-lg-2 mr-1`}
        >
          Купуване
        </button>

        <button
          onClick={() => setSearch({ ...search, action: "Rent", price: "", priceRange: null })}
          className={`btn ${search.action === "Rent" ? "btn-success" : "btn-outline-success"} col-lg-2 mr-1`}
        >
          Под наем
        </button>

        <button
          onClick={() => setSearch({ ...search, type: "House", price: "", priceRange: null })}
          className={`btn ${search.type === "House" ? "btn-primary" : "btn-outline-primary"} col-lg-2 mr-1`}
        >
          Къща
        </button>

        <button
          onClick={() => setSearch({ ...search, type: "Land", price: "", priceRange: null })}
          className={`btn ${search.type === "Land" ? "btn-primary" : "btn-outline-primary"} col-lg-2 mr-1`}
        >
          Земя
        </button>

        <div className="dropdown">
          <button
            className="btn btn-warning dropdown-toggle mr-1"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {search?.price || "Цена"}
          </button>
          <ul className="dropdown-menu">
            {search.action === "Buy" ? (
              sellPrices?.map((p) => (
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
              ))
            ) : (
              rentPrices?.map((p) => (
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
              ))
            )}
          </ul>
        </div>

        <button onClick={handleSearch} className="btn btn-danger col-lg-2 mr-1">
          Потърси
        </button>

        <button onClick={clearFilters} className="btn btn-primary col-lg-2 mr-1">
          Изчисти
        </button>
      </div>
    </div>
  );
}
