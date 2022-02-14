import { Question, GameState, Player } from "./GameInterfaces";

export interface ServerToClientEvents {
  newQuestion: (questionIndex: number, question: Question) => void;
  timer: (timer: number) => void;
  questionFinished: (bonnesReponses: number[]) => void;
  gameFinished: () => void;
}

export interface ClientToServerEvents {
  register: (
    pseudo: string,
    callback: (error: false | string, player?: Player) => void
  ) => void;
  reconnect: (
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

  /****** PLAYER ******/
  answerQuestion: (
    questionIndex: number,
    answers: number[],
    callback: (error: false | string) => void
  ) => void;
  getGameState: (callback: (gameState: GameState) => void) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
