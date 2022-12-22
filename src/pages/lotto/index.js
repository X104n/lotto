import React, {useState} from "react";
import {Link} from "react-router-dom";
import {APIData} from "../../getAPIData";

const Lotto = () => {

    const [content, setContent] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    function handleStartChange(event) {
        setStartDate(event.target.value);
    }

    function handleEndChange(event) {
        setEndDate(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const data = await APIData(startDate, endDate);
        if(data) {
            setContent(true)
        }
    }

    return (
        <div>
            <h6>Enter start date, then end date. Output will come in the console</h6>
            <form onSubmit={handleSubmit}>
                <input type="date" id="startDate" name="startDate" value={startDate} onChange={handleStartChange} />
                <input type="date" id="endDate" name="endDate" value={endDate} onChange={handleEndChange} />
                <button type="submit">Submit</button>
            </form>
            <div>
                {content ? <div text={"1111111"}/> : <div text={"2222222"}/>}
            </div>
            <Link to="/">Home</Link>
        </div>
    );
};

export default Lotto;