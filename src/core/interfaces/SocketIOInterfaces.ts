import {
  Question,
  GameState,
  Player,
  GameStateJeuPasEncoreCommence,
  GameStateQuestionCommence,
  GameStateQuestionTermine,
  GameStateJeuTermine,
} from "./GameInterfaces";

export interface ServerToClientEvents {
  // PLAYER/ADMIN/VIEWER
  gameStateChangeToJeuPasEncoreCommence: (
    gameStateData: GameStateJeuPasEncoreCommence
  ) => void;
  gameStateChangeToQuestionCommenceAvant: (
    gameStateData: GameStateQuestionCommence
  ) => void;
  gameStateChangeToQuestionCommenceApres: (
    gameStateData: GameStateQuestionCommence
  ) => void;
  gameStateChangeToQuestionTermine: (
    gameStateData: GameStateQuestionTermine
  ) => void;
  gameStateChangeToJeuTermine: (gameStateData: GameStateJeuTermine) => void;
  timer: (timer: number) => void;

  // VIEWER
  newAnswer: (pseudo: string, answers: string[]) => void;
}

export interface ClientToServerEvents {
  register: (
    pseudo: string,
    token: string,
    callback: (error: false | string, player?: Player) => void
  ) => void;
  /****** ADMIN ******/
  adminGetQuestions: (
    callback: (error: false | string, questions?: Question[]) => void
  ) => void;
  adminStartQuestion: (
    questionIndex: number,
    callback: (error: false | string) => void
  ) => void;
  adminStopQuestion: (
    quesitonIndex: number,
    callback: (error: false | string) => void
  ) => void;
  adminFinishGame: (callback: (error: false | string) => void) => void;
  adminResetGame: (callback: (error: false | string) => void) => void;

  /****** PLAYER ******/
  answerQuestion: (
    questionIndex: number,
    answers: number[] | string,
    callback: (error: false | string) => void
  ) => void;
  getGameState: (
    callback: (
      gameState: GameState,
      gameStateData:
        | GameStateJeuPasEncoreCommence
        | GameStateQuestionCommence
        | GameStateQuestionTermine
        | GameStateJeuTermine
    ) => void
  ) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
