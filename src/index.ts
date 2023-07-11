import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'

import createMQProducer from './pub-sub/producer'
import createMQConsumer from './pub-sub/consumer'
import Booking from './controllers/purchaseController'

const booking = new Booking();

dotenv.config()

const PORT = parseInt(String(process.env.PORT), 10) || 3000
const AMQP_URL = String(process.env.AMQP_URL)
const QUEUE_NAME = String(process.env.QUEUE_NAME)

const app = express()
app.use(express.json());
const producer = createMQProducer(AMQP_URL, QUEUE_NAME)
const consumer = createMQConsumer(AMQP_URL, QUEUE_NAME)

consumer()

// app.use(bodyParser.json())

// app.post('/book-ticket', (req: Request, res: Response) => {
//   const { email, password } = req.body
//   console.log('Registering user...')
//   const msg = {
//     action: 'BOOK-TICKET',
//     data: { email, password },
//   }
//   producer(JSON.stringify(msg))

//   return res.send('OK')
// })

// app.get('/', (req: Request, res: Response) => {
//   res.send('health check ok!')
// })

// app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`)
// })

app.post('/cinema', (req: Request, res: Response) => {
  const seatCount = req.body.seatCount;

  if (!seatCount || typeof seatCount !== 'number' || seatCount <= 0) {
    return res.status(400).json({ error: 'Invalid seatCount' });
  }

  const cinema = booking.createCinema(seatCount);

  res.status(201).json({ cinemaId: cinema.id });
});

app.post('/cinema/:cinemaId/purchase', (req: Request, res: Response) => {
  const cinemaId = req.params.cinemaId;
  const seatNumber = req.body.seatNumber;

  if (!cinemaId || !seatNumber) {
    return res.status(400).json({ error: 'cinemaId and seatNumber are required' });
  }

  const result = booking.purchaseSeat(cinemaId, seatNumber);

  if (!result) {
    return res.status(404).json({ error: 'Seat not found' });
  }

  if (result === 'Seat already purchased') {
    return res.status(409).json({ error: 'Seat already purchased' });
  }

  res.json({ seatNumber: result });
});

app.post('/cinema/:cinemaId/purchase-consecutive', (req: Request, res: Response) => {
  const cinemaId = req.params.cinemaId;

  if (!cinemaId) {
    return res.status(400).json({ error: 'cinemaId is required' });
  }

  const result = booking.purchaseTwoConsecutiveSeats(cinemaId);

  if (!result) {
    return res.status(404).json({ error: 'Consecutive seats not found' });
  }

  res.json({ seats: result });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
