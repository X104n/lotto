import React, {useState} from 'react';

const SliderButton = () => {

    const [value, setValue] = useState(2022);

    return (
        <div>
            <label htmlFor="slider">Slider value: {value}</label>
            <input
                type="range"
                id="slider"
                min="2012"
                max="2022"
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
        </div>
    )
}

export default SliderButton;