import { Server } from "socket.io";
import {
  GameState,
  GameStateJeuPasEncoreCommence,
  GameStateJeuTermine,
  GameStateQuestionCommence,
  GameStateQuestionTermine,
  Player,
  PlayerType,
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
    origin: "http://expose.simon511000.fr:3000",
    credentials: true,
  },
});

const delayQuestion = 10;
const game: GameManager = new GameManager();

io.on("connection", (socket) => {
  socket.on("register", (pseudo, token, callback) => {
    const newToken =
      new Date().getTime().toString(36) + Math.random().toString(36).slice(2); // source : https://stackoverflow.com/questions/23327010/how-to-generate-unique-id-with-node-js

    const player: Player = {
      playerId: socket.id,
      token: newToken,
      type: game.getPlayerType(pseudo),
      pseudo,
      points: 0,
      questionsRepondues: [],
    };

    const isPlayerAdded = game.addPlayer(player);

    if (!isPlayerAdded && !game.reconnectWithToken(token, socket.id)) {
      callback(
        "Ce pseudo a déjà été utilisé, changez de pseudo ou appuyez sur 'se reconnecter'"
      );
    } else {
      callback(false, player);
    }
  });

  /****** ADMIN ******/
  socket.on("adminGetQuestions", (callback) => {
    const player = game.getPlayer(socket.id);
    if (player !== undefined) {
      if (player.type == PlayerType.Admin) {
        callback(false, game.getQuestions());
      } else {
        return callback(
          "Vous devez être admin pour effectuer cette opération."
        );
      }
    } else {
      callback("Erreur d'authentification, veuillez rafraichir la page.");
    }
  });

  socket.on("adminStartQuestion", (questionIndex, callback) => {
    const player = game.getPlayer(socket.id);
    if (player !== undefined) {
      if (player.type == PlayerType.Admin) {
        // Si une question est déjà en cours, on ne peux pas en démarrer une nouvelle
        if (game.getCurrentIndexQuestion() === -1) {
          const question = game.getQuestions()[questionIndex];
          const gameStateData: GameStateQuestionCommence = {
            questionIndex,
            question: {
              ...question,
              bonnesReponses: [],
            },
            questionType: question.questionType,
          };
          game.setGameState(GameState.QuestionCommenceAvant, gameStateData);
          // On envoie la question sans divulger les bonnes réponses
          io.sockets.emit(
            "gameStateChangeToQuestionCommenceAvant",
            gameStateData
          );

          // On attend le délais
          let tempsRestantDelais = delayQuestion;
          if (tempsRestantDelais > 0) {
            const timerTick = () => {
              io.sockets.emit("timer", tempsRestantDelais);
              tempsRestantDelais--;
              // Quand le délais est terminé, on démarre la question
              if (tempsRestantDelais === -1) {
                clearInterval(game.getTimer()!);
                game.setGameState(
                  GameState.QuestionCommenceApres,
                  gameStateData
                );
                // On envoie la question sans divulger les bonnes réponses
                io.sockets.emit(
                  "gameStateChangeToQuestionCommenceApres",
                  gameStateData
                );
                let tempsRestantQuestion = question.temps;
                if (tempsRestantQuestion > 0) {
                  const timerTick = () => {
                    io.sockets.emit("timer", tempsRestantQuestion);
                    tempsRestantQuestion--;
                    // Quand le timer est terminé, on termine la question
                    if (tempsRestantQuestion === -1) {
                      const gameStateData: GameStateQuestionTermine = {
                        questionIndex,
                        question: game.getQuestions()[questionIndex],
                      };
                      game.setGameState(
                        GameState.QuestionTermine,
                        gameStateData
                      );
                      io.sockets.emit(
                        "gameStateChangeToQuestionTermine",
                        gameStateData
                      );
                      clearInterval(game.getTimer()!);
                    }
                  };
                  timerTick();
                  game.setTimer(setInterval(timerTick, 1000));
                }
              }
            };
            timerTick();
            game.setTimer(setInterval(timerTick, 1000));
          }
        } else {
          callback(
            "Veuillez stopper la question en cours avant d'en démarrer une nouvelle."
          );
        }
      } else {
        callback("Vous devez être admin pour effectuer cette opération.");
      }
    } else {
      callback("Erreur d'authentification, veuillez rafraichir la page.");
    }
  });

  socket.on("adminStopQuestion", (questionIndex, callback) => {
    const player = game.getPlayer(socket.id);
    if (player !== undefined) {
      if (player.type == PlayerType.Admin) {
        // Si la question n'est pas déjà en cours, il est inutile de la stopper
        if (game.getCurrentIndexQuestion() === questionIndex) {
          const gameStateData: GameStateQuestionTermine = {
            questionIndex,
            question: game.getQuestions()[questionIndex],
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
    } else {
      callback("Erreur d'authentification, veuillez rafraichir la page.");
    }
  });

  socket.on("adminFinishGame", (callback) => {
    const player = game.getPlayer(socket.id);
    if (player !== undefined) {
      if (player.type == PlayerType.Admin) {
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
    } else {
      callback("Erreur d'authentification, veuillez rafraichir la page.");
    }
  });

  socket.on("adminResetGame", (callback) => {
    const player = game.getPlayer(socket.id);
    if (player !== undefined) {
      if (player.type == PlayerType.Admin) {
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
    } else {
      callback("Erreur d'authentification, veuillez rafraichir la page.");
    }
  });

  /****** PLAYER ******/

  socket.on("getGameState", (callback) => {
    callback(game.getGameState(), game.getGameStateData());
  });

  socket.on("answerQuestion", (questionIndex, answers, callback) => {
    if (game.getPlayer(socket.id) !== undefined) {
      // On vérifie que le joueur répond à une question toujours en cours
      if (game.getCurrentIndexQuestion() === questionIndex) {
        // On vérifie que le joueur n'a pas déjà répondu à la question
        if (!game.hasAlreadyAnswered(socket.id, questionIndex)) {
          game.addAnswered(socket.id, questionIndex);
          game.game.viewers.forEach((viewer) => {
            if (Array.isArray(answers)) {
              io.to(viewer).emit(
                "newAnswer",
                game.getPlayer(socket.id)!.pseudo,
                game
                  .getQuestions()
                  [questionIndex].reponsesPossibles.flatMap((reponse, i) =>
                    answers.includes(i) ? [reponse] : []
                  )
              );
            } else {
              io.to(viewer).emit(
                "newAnswer",
                game.getPlayer(socket.id)!.pseudo,
                [answers]
              );
            }
          });
          callback(false);
        } else {
          callback("Vous avez déjà répondu à cette question");
        }
      } else {
        callback("La question n'est pas/plus en cours");
      }
    } else {
      callback("Erreur d'authentification, veuillez rafraichir la page.");
    }
  });
});

console.log(`Démarrage sur le port ${port}`);
io.listen(port);
