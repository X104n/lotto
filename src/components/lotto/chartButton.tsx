import { useState } from 'react';
import { APIData } from '../../getAPIData';
import { Chart } from './chart';

const ChartButton = () => {
  const [content, setContent] = useState(false);
  const [globalData, setGlobalData] = useState<unknown[] | undefined>(undefined);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = await APIData(startDate, endDate);
    if (data) {
      setContent(true);
      setGlobalData(data);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="date">
        <input
          type="date"
          className="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <p></p>
        <button type="submit">Submit</button>
      </form>
      {content && globalData ? <Chart data={globalData as Parameters<typeof Chart>[0]['data']} /> : null}
    </div>
  );
};

export default ChartButton;
