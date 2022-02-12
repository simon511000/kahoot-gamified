export interface Player {
  playerId: string; // socket.id
  pseudo: string;
  points: number; // bonne réponse = +1 point
}

export enum QuestionType {
  Burger, // QCM multiple
  GarsQuiBouffe, // QCM simple
  Tables, // QCM simple
  Ouverte, // Texte
}

export interface Question {
  type: QuestionType;
  question: string;
  reponsesPossibles?: string[]; // null si question ouverte
  bonnesReponses: string[];
  temps: number; // temps en seconde (0 si manuel)
}

export enum GameState {
  PasEncoreCommence,
  EnJeu,
  EnAttenteProchainJeu,
  Termine,
}

export interface Game {
  gameState: GameState;
  questionCourante: number; // Index de la question courante (-1 si aucune)
  joueurs: Player[];
  questions: Question[];
}
