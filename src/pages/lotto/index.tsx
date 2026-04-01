import { useState } from 'react';
import ChartButton from '../../components/lotto/chartButton';
import SliderButton from '../../components/lotto/sliderButton';
import ListButton from '../../components/lotto/listButton';
import OtherButton from '../../components/lotto/otherButton';

type ActiveElement = '' | 'chart' | 'slider' | 'list' | 'other';

const Lotto = () => {
  const [currentElement, setCurrentElement] = useState<ActiveElement>('');

  function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    setCurrentElement(event.currentTarget.value as ActiveElement);
  }

  return (
    <div>
      <div className="lotto">
        <h1>Lotto</h1>
        <p>
          Vanlig lotto som går på Norsk-Tipping. Velg en start dato og en slutt dato så vil det
          komme en graf som viser antall trekninger av alle tall mellom de to datoene du valgte.
        </p>
      </div>

      <div className="statButtons">
        <button onClick={handleButtonClick} value="chart" className="button-17">
          Chart(Button 1)
        </button>
        <button onClick={handleButtonClick} value="slider" className="button-17">
          Slider(Button 2)
        </button>
        <button onClick={handleButtonClick} value="list" className="button-17">
          List(Button 3)
        </button>
        <button onClick={handleButtonClick} value="other" className="button-17">
          Some other thing(Button 4)
        </button>
      </div>

      <br />

      <div className="lottoData">
        {currentElement === 'chart' && <ChartButton />}
        {currentElement === 'slider' && <SliderButton />}
        {currentElement === 'list' && <ListButton />}
        {currentElement === 'other' && <OtherButton />}
      </div>
    </div>
  );
};

export default Lotto;
