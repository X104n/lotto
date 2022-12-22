import Home from './pages';
import About from './pages/about';
import Lotto from "./pages/lotto/index";
import Viking from "./pages/viking/index";
import Euro from "./pages/euro/index";
import {
    Routes,
    Route
} from "react-router-dom";


function App() {
    return (
        <Routes>
            <Route exact path='/' exact element={<Home />} />
                <Route path='/lotto/index' element={<Lotto />} />
                <Route path='/viking/index' element={<Viking />} />
                <Route path='/euro/index' element={<Euro />} />
            <Route path='/about' element={<About />} />
        </Routes>
    );

}


export default App;
