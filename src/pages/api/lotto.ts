import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fromDate, toDate } = req.query;

  if (!fromDate || !toDate) {
    return res.status(400).json({ error: 'fromDate and toDate are required' });
  }

  const url = `https://api.norsk-tipping.no/LotteryGameInfo/v2/api/results/lotto?fromDate=${fromDate}&toDate=${toDate}`;

  const response = await axios.get(url);
  return res.status(200).json(response.data);
}
