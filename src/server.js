import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { research } from './agent.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.json()) // For parsing JSON request body
app.use(express.static('public'))

app.post('/api/research', async (req, res) => {
  const { name, company } = req.query

  if (!name || !company) {
      return res.status(400).send('name and company are required query parameters')
  }

  try {
      const result = await research(name, company)
      res.json(result)
  } catch (error) {
      res.status(500).send('Internal Server Error')
  }
})

io.on('connection', (socket) => {
  console.log('Client connected')

  socket.on('research', async(name, company) => {
    const result = await research(name, company)
    socket.emit('showResult', result)
  })
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})