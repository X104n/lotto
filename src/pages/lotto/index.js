import React from "react";
import {Link} from "react-router-dom";
import APIData from "../../getAPIData";

const Lotto = () => {
    return (
        <div>
            <h1>
                <APIData />
            </h1>
            <Link to="/">Home</Link>
        </div>
    );
};

export default Lotto;