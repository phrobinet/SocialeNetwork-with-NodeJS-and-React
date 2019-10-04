import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import Signin from '../user/Signin';

const isActive = (history, path) => {
    if (history.location.pathname === path) return { color: "#ff9900" };
    else return { color: "#ffffff" };
};

const Menu = ({ history }) => (
    <div className="row  bg-dark d-flex">
        <div className="p-2">
            <ul className="nav nav-tabs">
                <li className="nav-item ml-3">
                    <Link
                        className="nav-link"
                        style={isActive(history, "/")}
                        to="/"
                    >
                        Accueil
                    </Link>
                </li>

                <li className="nav-item ml-3">
                    <Link
                        className="nav-link"
                        style={isActive(history, "/users")}
                        to="/users"                        
                    >
                        La communauté
                    </Link>
                </li>
                
                <li className="nav-item ml-3">
                            <Link
                                to={`/post/create`}
                                style={isActive(history, `/post/create`)}
                                className="nav-link"
                            >
                                Publier un article
                            </Link>
                        </li>
            </ul>
        </div>
        <div className="p-2">
            <ul className="nav nav-tabs float-right">
                {!isAuthenticated() && (
                    <>
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                style={isActive(history, "/signin")}
                                to="/signin"
                            >
                                Connexion
                            </Link>
                        </li>
                        <li className="nav-item ml-2">
                            <Link
                                className="nav-link"
                                style={isActive(history, "/signup")}
                                to="/signup"
                            >
                                Inscription
                            </Link>
                        </li>
                    </>
                )}

                {isAuthenticated() && (
                    <>
                        <li className="nav-item ml-3">
                            <Link
                                to={`/findpeople`}
                                style={isActive(history, `/findpeople`)}
                                className="nav-link"
                            >
                                Trouver des amis
                            </Link>
                        </li>

                        <li className="nav-item ml-3">
                            <span
                                className="nav-link"
                                style={
                                    (isActive(history, "/signup"),
                                    { cursor: "pointer", color: "#fff" })
                                }
                                onClick={() => signout(() => history.push("/"))}
                            >
                                Déconnexion
                            </span>
                        </li>
                        </>
                        )}
                    {isAuthenticated() && isAuthenticated().user.role !== "admin" && (
                        <div className="nav-item ml-7" >
                        {/* <li  > */}
                            <Link
                                to={`/user/${isAuthenticated().user._id}`}
                                style={{color: '#87CEFA'}}
                                className="nav-link"
                            >
                                {`Bonjour, ${isAuthenticated().user.name}`}
                            </Link>
                        {/* </li> */}
                        </div>

                )}
                {isAuthenticated() && isAuthenticated().user.role === "admin" && (
                    <li className="nav-item ml-3">
                        <Link to={`/admin`} style={isActive(history, `/admin`)} className="nav-link">
                            Dashboard
                        </Link>
                    </li>
                )}
            </ul>
        </div>

    </div>
);

export default withRouter(Menu);
