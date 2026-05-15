const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

app.use(cors())
app.use(express.json())

let rankings = []

// =====================================
// スコア保存
// =====================================

app.post("/score", (req, res) => {

  const {
    score,
    difficulty,
    name,
  } = req.body

  rankings.push({

    name: name || "NO NAME",

    score,

    difficulty,

    time: Date.now(),
  })

  rankings.sort(
    (a, b) => b.score - a.score
  )

  rankings = rankings.slice(0, 5)

  res.json({ ok: true })
})

// =====================================
// ランキング取得
// =====================================

app.get(
  "/ranking/:difficulty",

  (req, res) => {

    const difficulty =
      req.params.difficulty

    const filtered =
      rankings.filter(

        (r) =>
          r.difficulty ===
          difficulty
      )

    res.json(filtered)
  }
)

// =====================================
// 起動
// =====================================
io.on("connection", (socket) => {

  console.log("connected")

  socket.on(
    "grazeAttack",

    () => {

      socket.broadcast.emit(
        "receiveAttack",
        {
          type: "circle",
        }
      )
    }
  )

  socket.on("disconnect", () => {

    console.log("disconnected")
  })
})
server.listen(3000, () => {
  console.log(
    "socket server running"
  )
})