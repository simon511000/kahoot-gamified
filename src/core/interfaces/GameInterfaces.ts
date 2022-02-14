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
  timerInterval?: NodeJS.Timer;
}
