import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Banner from "../components/banner/Banner";
import bannerPhoto from "../images/door.jpg";
import "./css/Form.css";

export default function Login() {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // hooks
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(email, password);
      setLoading(true);
      const { data } = await axios.post(`/login`, {
        email,
        password,
      });
      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        setAuth(data);
        localStorage.setItem("auth", JSON.stringify(data));
        toast.success("Успешно вписване");
        setLoading(false);
        location?.state !== null 
          ? navigate(location.state) 
          : navigate("/");
      }
      console.log(data);
    } catch (err) {
      console.log(err);
      toast.error("Нещо се обърка. Опитайте отново.");
      setLoading(false);
    }
  };

  return (
    <div>
      <Banner imageUrl={bannerPhoto} title="Вписване" />

      <div className="form-container">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Имейл"
              className="form-input"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Парола"
              className="form-input"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button disabled={loading} className="form-button">
              {loading ? "Зареждане..." : "Вписване"}
            </button>
          </form>
          <div className="form-links">
            <Link className="form-link" to="/auth/forgot-password">
              Забравена парола
            </Link>
            <Link className="form-link" to="/register">
              Регистрирай се
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}