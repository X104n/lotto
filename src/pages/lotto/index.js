import React, {useState} from "react";
import ChartButton from "./chartButton";
import SliderButton from "./sliderButton";
import ListButton from "./listButton";
import OtherButton from "./otherButton";

const Lotto = () => {

    const [currentElement, setCurrentElement] = useState("");

    function handleButtonClick(event) {
        setCurrentElement(event.target.value);
    }

    return (
        <div>
            <div className={'lotto'}>
                <h1>
                    Lotto
                </h1>
                <p>
                    Vanlig lotto som går på Norsk-Tipping. Velg en start dato og en slutt dato så
                    vil det komme en graf som viser antall trekninger av alle tall mellom de to datoene
                    du valgte.
                </p>
            </div>


            <div className="statButtons">
                <button onClick={handleButtonClick} value={'chart'} class="button-17" >Chart(Button 1)</button>
                <button onClick={handleButtonClick} value="slider" class="button-17" >Slider(Button 2)</button>
                <button onClick={handleButtonClick} value="list" class="button-17" >List(Button 3)</button>
                <button onClick={handleButtonClick} value="other" class="button-17" >Some other thing(Button 4)</button>
            </div>

            <br></br>

            <div className={'lottoData'}>
                {currentElement === 'chart' && <ChartButton />}
                {currentElement === 'slider' && <SliderButton />}
                {currentElement === 'list' && <ListButton />}
                {currentElement === 'other' && <OtherButton />}
            </div>
        </div>
    );
};

export default Lotto;