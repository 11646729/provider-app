import express, { json } from "express"
import { connect } from "amqplib"

const app = express()
app.use(json())

const PORT = process.env.PORT || 4001
const rabbitmqBrokerUrl = "amqp://localhost:5672"
const queueName = "test-queue"

var channel, connection

connectQueue() // call connectQueue function

async function connectQueue() {
  try {
    connection = await connect(rabbitmqBrokerUrl)
    channel = await connection.createChannel()

    // connect to 'test-queue', create one if doesnot exist already
    await channel.assertQueue(queueName)
  } catch (error) {
    console.log(error)
  }
}

const sendData = async (data) => {
  // send data to queue
  await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)))

  // close the channel and connection
  await channel.close()
  await connection.close()
}

app.get("/send-msg", (req, res) => {
  const data = {
    title: "Six of Crows",
    author: "Leigh Burdugo",
  }

  // console.log(data)

  sendData(data)

  console.log("A message is sent to queue")
  res.send("Message Sent")
})

app.listen(PORT, () => console.log("Server running at port " + PORT))
