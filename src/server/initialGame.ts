import {
  Game,
  GameState,
  QuestionType,
} from "../core/interfaces/GameInterfaces";

export const initialGame: Game = {
  gameState: GameState.JeuPasEncoreCommence,
  gameStateData: {},
  joueurs: [],
  questions: [
    {
      // 1er débat
      type: QuestionType.Ouverte,
      question: "1er débat", // TODO: à compéter
      reponsesPossibles: [],
      bonnesReponses: [],
      temps: 0,
    },
    {
      // QCM 1
      type: QuestionType.GarsQuiBouffe,
      question: "Quelle est la date de la loi séparant l’Eglise et l’Etat ?",
      reponsesPossibles: [
        "19 décembre 1901",
        "9 décembre 1901",
        "29 décembre 1901",
      ],
      bonnesReponses: [1],
      temps: 30,
    },
    {
      // QCM 2
      type: QuestionType.Tables,
      question:
        "À quelle fréquence êtes-vous confronté au débat de laïcité dans le milieu scolaire ?",
      reponsesPossibles: ["Un peu", "Beaucoup", "Passionnément", "À la folie"],
      bonnesReponses: [],
      temps: 30,
    },
    {
      // QCM 3
      type: QuestionType.GarsQuiBouffe,
      question: "La restauration sociale est un service public …",
      reponsesPossibles: [
        "Parfois obligatoire",
        "Toujours obligatoire",
        "Jamais obligatoire",
      ],
      bonnesReponses: [0],
      temps: 30,
    },
    {
      // QCM 4
      type: QuestionType.Burger,
      question:
        "Quels sont les principes que doivent respecter les autorités en charge d’un service public ?",
      reponsesPossibles: ["Égalité", "Accessibilité", "Rapidité", "Continuité"],
      bonnesReponses: [0, 1, 3],
      temps: 0,
    },
    {
      // QCM 5
      type: QuestionType.GarsQuiBouffe,
      question:
        "Quelle est l’autorité publique gérant les cantines des écoles primaires ?",
      reponsesPossibles: [
        "L'État",
        "La région",
        "Le département",
        "Le juge",
        "La commune",
      ],
      bonnesReponses: [4],
      temps: 30,
    },
    {
      // Débat 2
      type: QuestionType.Ouverte,
      reponsesPossibles: [],
      question:
        "En tant que maire, quels seraient vos arguments pour accepter ou refuser les repas de substitution ?",
      bonnesReponses: [],
      temps: 0,
    },
  ],
};
