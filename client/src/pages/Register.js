import { useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Banner from "../components/banner/Banner";
import bannerPhoto from "../images/door.jpg";
import "./css/Form.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post("/pre-register", {
        email,
        password,
      });
      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        toast.success("Моля проверете имейла си за линк за активация.");
        setLoading(false);
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.log(err);
      toast.error("Нещо се обърка. Опитайте отново.");
      setLoading(false);
    }
  };

  return (
    <div>
      <Banner imageUrl={bannerPhoto} title="Регистрация" />
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
              {loading ? "Зареждане..." : "Регистрирай се"}
            </button>
          </form>
          <div className="form-links">
            <Link className="form-link" to="/login">
              Вписване
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}