import axios from 'axios';

export async function APIData(startDate: string, endDate: string): Promise<unknown[]> {
  const data: unknown[] = [];

  const url = `/api/lotto?fromDate=${startDate}&toDate=${endDate}`;

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
    .catch((err) => console.log(err));

  return data;
}
