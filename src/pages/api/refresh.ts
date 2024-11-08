import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    await res.revalidate('/')
    return res.status(200).json({ message: 'Revalidated index page' })
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
