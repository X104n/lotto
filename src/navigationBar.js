import {Link} from "react-router-dom";
import React, {useEffect} from 'react';

function Navbar() {
    useEffect(() => {
        function handleScroll() {
            let navbar = document.querySelector(".nav ul");
            if (window.scrollY > 0) {
                navbar.style.padding = "5px";
            } else {
                navbar.style.padding = "20px";
            }
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav className="nav">
            <ul>
                <li className="ham">
                    <Link to="/idk">🍔</Link>
                </li>
            </ul>
            <ul>
                <li>
                    <Link to="/">🏠</Link>
                </li>
                <li>
                    <Link to="/lotto/index">🎰</Link>
                </li>
                <li>
                    <Link to="/viking/index">⚔️</Link>
                </li>
                <li>
                    <Link to="/euro/index">💶</Link>
                </li>
            </ul>
            <ul>
                <li>
                    <Link to="/about">🛈</Link>
                </li>
                <li>
                    <Link to="/login">🔒</Link>
                </li>
            </ul>

        </nav>
    )
        ;
}

export default Navbar;