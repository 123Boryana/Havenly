import React, {useState, useEffect} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Button } from "../home/Button";
import "./Main.css";

function Navbar() {
    const [auth, setAuth] = useAuth();
    const [button, setButton] = useState(true);

    const [click, setClick]  = useState(false);
    const navigate = useNavigate();

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if(window.innerWidth <= 960) {
            setButton(false)
        } else {
            setButton(true);
        }
    };

    useEffect(() => {
        showButton();
    }, []);

    window.addEventListener("resize", showButton);

    const logout = () => {
        setAuth({ user: null, token: "", refreshToken: "" });
        localStorage.removeItem("auth");
        navigate("/login");
      };
    
      const loggedIn =
        auth.user !== null && auth.token !== "" && auth.refreshToken !== "";
    
      const handlePostAdClick = () => {
        if (loggedIn) {
          navigate("/ad/create");
        } else {
          navigate("/login");
        }
      };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <NavLink to='/' className="navbar-logo" onClick={closeMobileMenu}>
                        <i className="fa-solid fa-house mb-2"></i> HAVENLY.
                    </NavLink>
                    <div className="menu-icon" onClick={handleClick}>
                        <i className={click ? "fas fa-times" : "fas fa-bars"} />
                    </div>
                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                        <li className="nav-item">
                            <NavLink to='/' className="nav-links" onClick={closeMobileMenu}>
                                Начало
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-links" to="/buy" onClick={closeMobileMenu}>
                                Купуване
                            </NavLink>
                        </li>
                    <li className="nav-item">
                    <NavLink className="nav-links" to="/rent" onClick={closeMobileMenu}>
                                Наемане
                            </NavLink>
                    </li>
                    <li className="nav-item">
                    <NavLink className="nav-links" to="/agents" onClick={closeMobileMenu}>
                                Агенти
                            </NavLink>
                    </li>
                    </ul>
                    { !loggedIn ? (
                        <>{button && <Button>Вписване</Button>}</> 
                    ) : ("")}
                    { loggedIn ? (
                        <li className="nav-item dropdown">
                        <a
                          className="nav-link dropdown-toggle "
                          href="#"
                          id="navbarDropdown"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {auth?.user?.name ? auth.user.name : auth.user.username}
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                          <li>
                            <NavLink className="dropdown-item" to="/dashboard" onClick={closeMobileMenu}>
                              Моите обяви
                            </NavLink>
                          </li>
                          <li>
                            <NavLink className="dropdown-item" to="/user/wishlist" onClick={closeMobileMenu}>
                                Списък с желания
                              </NavLink>
                          </li>
                          <li>
                            <NavLink className="dropdown-item" to="/user/enquiries" onClick={closeMobileMenu}>
                                Запитвания
                              </NavLink>
                          </li>
                          <li>
                            <NavLink className="dropdown-item" to="/user/profile" onClick={closeMobileMenu}>
                                Профил
                              </NavLink>
                          </li>
                          <li>
                            <NavLink className="dropdown-item" to="/user/settings" onClick={closeMobileMenu}>
                                Настройки
                              </NavLink>
                          </li>
                          <li>
                            <a onClick={logout} className="dropdown-item">
                              Излизане
                            </a>
                          </li>
                        </ul>
                      </li>
                    ) : ("")}
                </div>
            </nav>
        </>
    );
}

export default Navbar;