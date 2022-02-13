import { Server } from "socket.io";
import { Player, QuestionType } from "../../common/interfaces/GameInterfaces";
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
    const token =
      new Date().getTime().toString(36) + Math.random().toString(36).slice(2); // source : https://stackoverflow.com/questions/23327010/how-to-generate-unique-id-with-node-js

    const player: Player = {
      playerId: socket.id,
      token,
      isAdmin: game.isAdmin(pseudo),
      pseudo,
      points: 0,
      questionsRepondues: [],
    };

    const isPlayerAdded = game.addPlayer(player);

    if (isPlayerAdded) {
      console.log(`Le joueur ${pseudo} s'est inscrit avec succès!`);
      callback(false, player);
    } else {
      callback(
        "Ce pseudo a déjà été utilisé, changez de pseudo ou appuyer sur 'se reconnecter'"
      );
    }
  });

  socket.on("reconnect", (token, callback) => {
    const reconnected = game.reconnectWithToken(token, socket.id);
    if (reconnected !== false && reconnected !== true) {
      callback(false, reconnected);
    } else {
      callback("Impossible de se reconnecter, merci de vous (ré)inscrire");
    }
  });

  /****** ADMIN ******/
  socket.on("adminGetQuestions", (callback) => {
    const player = game.getPlayer(socket.id);
    if (player.isAdmin) {
      callback(false, game.getQuestions());
    } else {
      return callback("Vous devez être admin pour effectuer cette opération.");
    }
  });

  socket.on("adminStartQuestion", (questionIndex, callback) => {
    const player = game.getPlayer(socket.id);
    if (player.isAdmin) {
      // Si une question est déjà en cours, on ne peux pas en démarrer une nouvelle
      if (game.getCurrentIndexQuestion() === -1) {
        game.setCurrentIndexQuestion(questionIndex);
        io.sockets.emit(
          "newQuestion",
          questionIndex,
          game.getQuestions()[questionIndex]
        );

        // On broadcast le timer
        let tempsRestant = game.getQuestions()[questionIndex].temps;
        if (tempsRestant > 0) {
          game.setTimer(
            setInterval(() => {
              io.sockets.emit("timer", tempsRestant);
              tempsRestant--;
              // Quand le timer est terminé, on termine la question
              if (tempsRestant === 0) {
                io.sockets.emit(
                  "questionFinished",
                  game.getBonnesReponses(questionIndex)
                );
              }
            }, 1000)
          );
        }
      } else {
        callback(
          "Veuillez stopper la question en cours avant d'en démarrer une nouvelle."
        );
      }
    } else {
      callback("Vous devez être admin pour effectuer cette opération.");
    }
  });

  socket.on("adminStopQuestion", (questionIndex, callback) => {
    const player = game.getPlayer(socket.id);
    if (player.isAdmin) {
      // Si la question n'est pas déjà en cours, il est inutile de la stopper
      if (game.getCurrentIndexQuestion() !== questionIndex) {
        game.setCurrentIndexQuestion(-1);
        if (game.getTimer() !== null) {
          clearInterval(game.getTimer());
        }
        socket.broadcast.emit(
          "questionFinished",
          game.getBonnesReponses(questionIndex)
        );
      } else {
        callback("La question est déjà stoppée");
      }
    } else {
      callback("Vous devez être admin pour effectuer cette opération.");
    }
  });

  socket.on("adminFinishGame", (callback) => {
    const player = game.getPlayer(socket.id);
    if (player.isAdmin) {
      // Si une question est en cours, on ne peux pas stopper la partie
      if (game.getCurrentIndexQuestion() === -1) {
        socket.broadcast.emit("gameFinished");
      } else {
        callback(
          "Veuillez stopper la question en cours avant de terminer la partie."
        );
      }
    } else {
      callback("Vous devez être admin pour effectuer cette opération.");
    }
  });

  /****** PLAYER ******/

  socket.on("getGameState", (callback) => {
    callback(game.getGameState());
  });

  socket.on("answerQuestion", (questionIndex, answers, callback) => {
    // On vérifie que le joueur répond à une question toujours en cours
    if (game.getCurrentIndexQuestion() === questionIndex) {
      // On vérifie que le joueur n'a pas déjà répondu à la question
      if (!game.hasAlreadyAnswered(socket.id, questionIndex)) {
        // Si ce n'est pas une question ouverte et que le joueur a bon, on lui ajoute 1 point
        if (
          game.getQuestions()[questionIndex].type !== QuestionType.Ouverte &&
          game.isAnswersCorrect(questionIndex, answers)
        ) {
          game.addPoint(socket.id);
        }
      } else {
        callback("Vous avez déjà répondu à cette question");
      }
    } else {
      callback("La question n'est pas/plus en cours");
    }
  });
});

io.listen(port);
