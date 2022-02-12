import { Server } from "socket.io";
import { Question, GameState } from "../../common/interfaces/GameInterfaces";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../../common/interfaces/SocketIOInterfaces";
import { GameManager } from "./Game";

const port = parseInt(process.env.PORT) || 3000;

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>({
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});

const game: GameManager = new GameManager();

io.on("connection", (socket) => {
  socket.on("register", (pseudo, callback) => {
    console.log(`Nouveau joueur inscrit : ${pseudo}`);

    const isPlayerAdded = game.addPlayer({
      playerId: socket.id,
      pseudo: pseudo,
      points: 0,
    });

    callback(isPlayerAdded);
  });

  socket.on("getGameState", (callback) => {
    callback(game.getGameState());
  });
});

io.listen(port);
