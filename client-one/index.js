import express, { json } from "express"

const app = express()
app.use(json())

const PORT = process.env.PORT || 4002

import { connect } from "amqplib"
var channel, connection

connectQueue() // call connectQueue function
async function connectQueue() {
  try {
    connection = await connect("amqp://localhost:5672")
    channel = await connection.createChannel()

    // connect to 'test-queue', create one if doesnot exist already
    await channel.assertQueue("test-queue")

    channel.consume("test-queue", (data) => {
      // console.log(data)
      console.log("Data received : ", `${Buffer.from(data.content)}`)
      channel.ack(data)
    })
  } catch (error) {
    console.log(error)
  }
}

app.listen(PORT, () => console.log("Server running at port " + PORT))
