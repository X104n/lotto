import axios from 'axios';

const CHUNK_DAYS = 15 * 7 - 1; // 15 weeks, inclusive

export interface FetchProgress {
  current: number;
  total: number;
  from: string;
  to: string;
}

function chunkDateRange(startDate: string, endDate: string): Array<{ from: string; to: string }> {
  const chunks: Array<{ from: string; to: string }> = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const chunkEnd = new Date(current);
    chunkEnd.setDate(chunkEnd.getDate() + CHUNK_DAYS);
    if (chunkEnd > end) chunkEnd.setTime(end.getTime());

    chunks.push({
      from: current.toISOString().split('T')[0],
      to: chunkEnd.toISOString().split('T')[0],
    });

    current = new Date(chunkEnd);
    current.setDate(current.getDate() + 1);
  }

  return chunks;
}

export async function APIData(
  startDate: string,
  endDate: string,
  onProgress?: (progress: FetchProgress) => void
): Promise<unknown[]> {
  const chunks = chunkDateRange(startDate, endDate);
  const data: unknown[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const { from, to } = chunks[i];

    onProgress?.({ current: i + 1, total: chunks.length, from, to });

    await axios
      .get(
        `https://api.norsk-tipping.no/LotteryGameInfo/v2/api/results/lotto?fromDate=${from}&toDate=${to}`
      )
      .then((response) => {
        for (const outerValue of Object.values(response.data)) {
          if (Array.isArray(outerValue)) {
            for (const innerValue of outerValue) {
              data.push(innerValue);
            }
          }
        }
      })
      .catch((err) => console.error('Failed to fetch lotto data:', err));
  }

  return data;
}
