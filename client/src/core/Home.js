import React from "react";
import Posts from "../post/Posts";
import { isAuthenticated } from "../auth";

const Home = () => (
    <div>
        <div className="jumbotron">
            <h2>Bonjour</h2>

            {!isAuthenticated() && (
                <>
                    <p className="my-4">Il faut être connecté afin d'avoir accès</p>
                </>
            )}


            
        </div>

        <div className="container">
            <Posts />
        </div>
    </div>
);

export default Home;
