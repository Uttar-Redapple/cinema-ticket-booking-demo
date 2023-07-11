import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'

import createMQProducer from './pub-sub/producer'

dotenv.config()

const PORT = parseInt(String(process.env.PORT), 10) || 3000
const AMQP_URL = String(process.env.AMQP_URL)
const QUEUE_NAME = String(process.env.QUEUE_NAME)

const app = express()
const producer = createMQProducer(AMQP_URL, QUEUE_NAME)

app.use(bodyParser.json())

app.post('/book-ticket', (req: Request, res: Response) => {
  const { email, password } = req.body
  console.log('Registering user...')
  const msg = {
    action: 'BOOK-TICKET',
    data: { email, password },
  }
  producer(JSON.stringify(msg))

  return res.send('OK')
})

app.get('/', (req: Request, res: Response) => {
  res.send('health check ok!')
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})