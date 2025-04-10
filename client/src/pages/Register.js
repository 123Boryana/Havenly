import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import Banner from "../components/banner/Banner";
import bannerPhoto from "../images/door.jpg";

export default function Register() {
  // state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // hooks
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/pre-register`, {
        email,
        password,
      });
      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        toast.success("Моля проверете имейла си, за да приключите регистрацията.");
        setLoading(false);
        navigate("/");
      }
      console.log(data);
    } catch (err) {
      console.log(err);
      toast.error("Нещо се обърка. Моля опитайте отново.");
      setLoading(false);
    }
  };

  return (
    <div>

      <Banner 
        imageUrl={bannerPhoto}
        title="Регистрация"
      />

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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={loading}
          className="form-button"
        >
          {loading ? "Изчакайте..." : "Регистрирай се"}
        </button>
      </form>
      <div className="form-links">
        <Link className="form-link" to="/login">
          Вече имам акаунт
        </Link>
      </div>
    </div>
  </div>
</div>
  );
}