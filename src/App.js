import SecondFile from './getAPIData.js'
import Home from './pages';
import About from './pages/about';
import {
    BrowserRouter as Router, Routes,
    Route,
    Link
} from "react-router-dom";


function App() {
    return (
        <Router>
        <Routes>
            <Route exact path='/' exact element={<Home />} />
            <Route path='/about' element={<About />} />
        </Routes>
        </Router>
    );

}


export default App;
