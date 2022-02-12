import { Question, GameState } from "./GameInterfaces";

export interface ServerToClientEvents {
  newQuestion: (questionIndex: number, question: Question) => void;
  questionFinished: (bonnesReponses: String[], userPoints: number) => void;
  gameFinished: () => void;
}

export interface ClientToServerEvents {
  register: (
    pseudo: string,
    callback: (pseudoAlreadyExists: boolean) => void
  ) => void;
  getGameState: (callback: (gameState: GameState) => void) => void;
  answerQuestion: (questionIndex: number, answers: String[]) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
