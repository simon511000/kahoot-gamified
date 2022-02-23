export enum PlayerType {
  Player,
  Admin,
  Viewer,
}

export interface Player {
  playerId: string; // socket.id
  token: string; // token stocké dans les cookies du joueur permettant de le reco en cas de deconnection
  type: PlayerType;
  pseudo: string;
  points: number; // bonne réponse = +1 point
  questionsRepondues: number[];
}

export enum GameType {
  Burger, // QCM multiple
  GarsQuiBouffe, // QCM simple
  Tables, // QCM simple
  Ouverte, // Texte
  Test, // Juste à fin de test //TODO: à supprimer
}

export enum QuestionType {
  Simple,
  Multiple
}

export interface Question {
  gameType: GameType;
  questionType: QuestionType,
  question: string;
  reponsesPossibles: string[]; // null si question ouverte
  bonnesReponses: number[];
  temps: number; // temps en seconde (0 si manuel)
}

export enum GameState {
  JeuPasEncoreCommence,
  QuestionCommenceAvant,
  QuestionCommenceApres,
  QuestionTermine,
  JeuTermine,
}

export interface GameStateJeuPasEncoreCommence {}
export interface GameStateQuestionCommence {
  questionIndex: number;
  question: Question; // L'objet Question dépourvu des bonnes réponses
  questionType: QuestionType;
}
export interface GameStateQuestionTermine {
  questionIndex: number;
  question: Question;
}
export interface GameStateJeuTermine {}

export interface Game {
  gameState: GameState;
  gameStateData:
    | GameStateJeuPasEncoreCommence
    | GameStateQuestionCommence
    | GameStateQuestionTermine
    | GameStateJeuTermine;
  joueurs: Player[];
  questions: Question[];
  timerInterval?: NodeJS.Timer;
  viewers: string[];
}
