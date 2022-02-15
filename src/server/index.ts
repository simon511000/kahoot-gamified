import { Server } from "socket.io";
import {
  GameState,
  GameStateJeuPasEncoreCommence,
  GameStateJeuTermine,
  GameStateQuestionCommence,
  GameStateQuestionTermine,
  Player,
} from "../core/interfaces/GameInterfaces";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../core/interfaces/SocketIOInterfaces";
import { GameManager } from "./Game";

const port = parseInt(process.env.PORT ?? "3001");

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>({
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
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
        "Ce pseudo a déjà été utilisé, changez de pseudo ou appuyez sur 'se reconnecter'"
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
    console.error(player);
    if (player.isAdmin) {
      // Si une question est déjà en cours, on ne peux pas en démarrer une nouvelle
      if (game.getCurrentIndexQuestion() === -1) {
        const question = game.getQuestions()[questionIndex];
        console.log("Démarrage de la question :", question);
        const gameStateData: GameStateQuestionCommence = {
          questionIndex,
          question: {
            ...question,
            bonnesReponses: [],
          },
        };
        game.setGameState(GameState.QuestionCommence, gameStateData);
        // On envoie la question sans divulger les bonnes réponses
        io.sockets.emit("gameStateChangeToQuestionCommence", gameStateData);

        // On broadcast le timer
        let tempsRestant = question.temps;
        if (tempsRestant > 0) {
          game.setTimer(
            setInterval(() => {
              io.sockets.emit("timer", tempsRestant);
              tempsRestant--;
              // Quand le timer est terminé, on termine la question
              if (tempsRestant === -1) {
                const gameStateData: GameStateQuestionTermine = {
                  bonnesReponses: game.getBonnesReponses(questionIndex),
                };
                game.setGameState(GameState.QuestionTermine, gameStateData);
                io.sockets.emit(
                  "gameStateChangeToQuestionTermine",
                  gameStateData
                );
                clearInterval(game.getTimer()!);
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
      console.log(game.getGameState(), game.getGameStateData());
      if (game.getCurrentIndexQuestion() === questionIndex) {
        const gameStateData: GameStateQuestionTermine = {
          bonnesReponses: game.getBonnesReponses(questionIndex),
        };
        game.setGameState(GameState.QuestionTermine, gameStateData);
        const timer = game.getTimer();
        if (timer !== undefined) {
          clearInterval(timer);
        }
        io.sockets.emit("gameStateChangeToQuestionTermine", gameStateData);
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
        const gameState: GameStateJeuTermine = {};
        game.setGameState(GameState.JeuTermine, gameState);
        io.sockets.emit("gameStateChangeToJeuTermine", gameState);
      } else {
        callback(
          "Veuillez stopper la question en cours avant de terminer la partie."
        );
      }
    } else {
      callback("Vous devez être admin pour effectuer cette opération.");
    }
  });

  socket.on("adminResetGame", (callback) => {
    const player = game.getPlayer(socket.id);
    if (player.isAdmin) {
      const gameState: GameStateJeuPasEncoreCommence = {};
      const timer = game.getTimer();
      if (timer !== undefined) {
        clearInterval(timer);
      }
      game.resetGame();
      game.setGameState(GameState.JeuPasEncoreCommence, gameState);
      io.sockets.emit("gameStateChangeToJeuPasEncoreCommence", gameState);
    } else {
      callback("Vous devez être admin pour effectuer cette opération.");
    }
  });

  /****** PLAYER ******/

  socket.on("getGameState", (callback) => {
    callback(game.getGameState(), game.getGameStateData());
  });

  socket.on("answerQuestion", (questionIndex, answers, callback) => {
    // On vérifie que le joueur répond à une question toujours en cours
    if (game.getCurrentIndexQuestion() === questionIndex) {
      // On vérifie que le joueur n'a pas déjà répondu à la question
      if (!game.hasAlreadyAnswered(socket.id, questionIndex)) {
        // Si la question a des réponses possibles, on lui ajoute 1 point
        if (
          game.getBonnesReponses(questionIndex).length > 0 &&
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

console.log(`Démarrage sur le port ${port}`);
io.listen(port);
