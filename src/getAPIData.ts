import axios from 'axios';

export async function APIData(startDate: string, endDate: string): Promise<unknown[]> {
  const data: unknown[] = [];

  const url = `https://api.norsk-tipping.no/LotteryGameInfo/v2/api/results/lotto?fromDate=${startDate}&toDate=${endDate}`;

  await axios
    .get(url)
    .then((response) => {
      const html = response.data;
      for (const outerValue of Object.values(html)) {
        if (Array.isArray(outerValue)) {
          for (const innerValue of outerValue) {
            data.push(innerValue);
          }
        }
      }
    })
    .catch((err) => console.error('Failed to fetch lotto data:', err));

  return data;
}
