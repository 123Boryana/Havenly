import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectRoute() {
  const [count, setCount] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    // redirect once count is equal to 0
    count === 0 && navigate("/");
    // cleanup
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <h2>Моля влезте в акаунта си. Пренасочване след {count} секунди.</h2>
    </div>
  );
}