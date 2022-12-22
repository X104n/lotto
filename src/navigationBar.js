import { Link } from "react-router-dom";

function Navbar() {
return (
        <nav className="nav">
            <ul>
                <li>
                    <Link to="/idk">Hamburger</Link>
                </li>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/lotto/index">Lotto</Link>
                </li>
                <li>
                    <Link to="/viking/index">Viking</Link>
                </li>
                <li>
                    <Link to="/euro/index">Euro</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;