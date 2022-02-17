export interface Player {
  playerId: string; // socket.id
  token: string; // token stocké dans les cookies du joueur permettant de le reco en cas de deconnection
  isAdmin: boolean;
  pseudo: string;
  points: number; // bonne réponse = +1 point
  questionsRepondues: number[];
}

export enum QuestionType {
  Burger, // QCM multiple
  GarsQuiBouffe, // QCM simple
  Tables, // QCM simple
  Ouverte, // Texte
  Test, // Juste à fin de test //TODO: à supprimer
}

export interface Question {
  type: QuestionType;
  question: string;
  reponsesPossibles?: string[]; // null si question ouverte
  bonnesReponses: number[];
  temps: number; // temps en seconde (0 si manuel)
}

export enum GameState {
  JeuPasEncoreCommence,
  QuestionCommence,
  QuestionTermine,
  JeuTermine,
}

export interface GameStateJeuPasEncoreCommence {}
export interface GameStateQuestionCommence {
  questionIndex: number;
  question: Question; // L'objet Question dépourvu des bonnes réponses
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
}
