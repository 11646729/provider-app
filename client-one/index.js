import express, { json } from "express"
import { connect } from "amqplib"

const app = express()
app.use(json())

const PORT = process.env.PORT || 4002
const rabbitmqUrl = "amqp://localhost:5672"
const queueName = "test-queue"

var channel, connection // global variables

async function connectQueue() {
  try {
    connection = await connect(rabbitmqUrl)
    channel = await connection.createChannel()

    // connect to 'test-queue', create one if doesn't exist already
    await channel.assertQueue(queueName)

    channel.consume(queueName, (data) => {
      console.log("Data received : ", `${Buffer.from(data.content)}`)
      channel.ack(data)
    })
  } catch (error) {
    console.log(error)
  }
}

connectQueue() // call connectQueue function

app.listen(PORT, () => console.log("Server running at port " + PORT))
