import React from "react";
import {Link} from "react-router-dom";
import SecondFile from "../../getAPIData";

const Lotto = () => {
    return (
        <div>
            <h1>
                <SecondFile />
            </h1>
            <Link to="/">Home</Link>
        </div>
    );
};

export default Lotto;