import { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../components/cards/UserCard";
import Banner from "../components/banner/Banner";
import bannerPhoto from "../images/Realestate-Tips.webp";

export default function Agents() {
  // state
  const [agents, setAgents] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/agents`);
      setAgents(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ marginTop: "-10%" }}
      >
        <div className="display-1">Зареждане...</div>
      </div>
    );
  }

  if(loading) {
    return (
        <div 
        className="d-flex justify-content-center align-items-center vh-100" 
        style={{marginTop: "-10%"}}>
            <div className="display-1">Зареждане...</div>
        </div>
    );
}

  return (
    <div>
      <Banner 
        imageUrl={bannerPhoto}
        title="Агенти"
      />
      <div className="container">
        <div className="row">
          {agents?.map((agent) => (
            <UserCard user={agent} key={agent._id} />
          ))}
        </div>
      </div>
    </div>
  );
}