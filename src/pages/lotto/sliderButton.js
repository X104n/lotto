import React from "react";

const SliderButton = () => {
    return (
        <div>
            <label htmlFor="slider">Slider:</label>
            <input type="range" id="slider" min="0" max="100" value="50"></input>
        </div>
    )
}

export default SliderButton;