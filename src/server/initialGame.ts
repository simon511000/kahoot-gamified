import { text } from "stream/consumers";
import {
  Game,
  GameState,
  GameType,
  QuestionType,
} from "../core/interfaces/GameInterfaces";

export const initialGame: Game = {
  gameState: GameState.JeuPasEncoreCommence,
  gameStateData: {},
  joueurs: [],
  questions: [
    // {
    //   // 1er débat
    //   type: QuestionType.Ouverte,
    //   question: "1er débat", // TODO: à compéter
    //   reponsesPossibles: [],
    //   bonnesReponses: [],
    //   temps: 0,
    // },
    // {
    //   // QCM 1
    //   gameType: GameType.Burger,
    //   questionType: QuestionType.Simple,
    //   question: "Quelle est la date de la loi séparant l’Eglise et l’Etat ?",
    //   reponsesPossibles: [
    //     "19 décembre 1901",
    //     "9 décembre 1901",
    //     "29 décembre 1901",
    //   ],
    //   bonnesReponses: [1],
    //   temps: 30,
    // },
    // {
    //   // QCM 2
    //   gameType: GameType.Burger,
    //   questionType: QuestionType.Simple,
    //   question:
    //     "À quelle fréquence êtes-vous confronté au débat de laïcité dans le milieu scolaire ?",
    //   reponsesPossibles: ["Un peu", "Beaucoup", "Passionnément", "À la folie"],
    //   bonnesReponses: [],
    //   temps: 30,
    // },
    {
      // QCM 1
      gameType: GameType.Burger,
      questionType: QuestionType.Simple,
      question:
        "Quelle est l’autorité publique gérant les cantines des écoles primaires ?",
      reponsesPossibles: [
        "Le département",
        "Le juge",
        "La commune",
        "La région",
      ],
      bonnesReponses: [2],
      temps: 30,
    },
    {
      // QCM 2
      gameType: GameType.Burger,
      questionType: QuestionType.Simple,
      question: "La restauration sociale est un service public …",
      reponsesPossibles: [
        "Obligatoire sauf dérogation du juge",
        "Toujours obligatoire",
        "Jamais obligatoire",
        "Parfois obligatoire",
      ],
      bonnesReponses: [3],
      temps: 30,
    },
    {
      // QCM 3
      gameType: GameType.Burger,
      questionType: QuestionType.Multiple,
      question:
        "Quels sont les principes que doivent respecter les autorités en charge d’un service public ?",
      reponsesPossibles: ["Continuité", "Rapidité", "Accessibilité", "Égalité"],
      bonnesReponses: [0, 2, 3],
      temps: 30,
    },
    {
      // QCM 4
      gameType: GameType.Burger,
      questionType: QuestionType.Multiple,
      question: "Quelle est la position du maire de Chalon-sur-saône ?",
      reponsesPossibles: [
        "le menu de alternatif n'est possible que le vendredi",
        "proposer un menu alternatif est contraire aux principes d'une république laïque",
        "proposer un menu alternatif, c'est opérer une discrimination",
        "il ne faut pas prendre en compte les considérations religieuse",
      ],
      bonnesReponses: [1, 2, 3],
      temps: -1,
    },
    {
      // QCM 5
      gameType: GameType.Burger,
      questionType: QuestionType.Multiple,
      question: "Quelle est la position du maire de Sarcelles ?",
      reponsesPossibles: [
        "il pense que les menus alternatifs sont contraire au principe de laïcité",
        "il rétablit les menus de substitutions",
        "la suppression des menus alternatifs exclurait une partie des élèves au nom de la laïcité",
        "il est favorable à la suppression des menus de substitutions",
      ],
      bonnesReponses: [1, 2],
      temps: 30,
    },
    {
      // QCM 6
      gameType: GameType.Burger,
      questionType: QuestionType.Simple,
      question: "dans l'arrêt Oullins du Conseil d'État du 23 octobre 2009 :",
      reponsesPossibles: [
        "la commune avait limité l'accès à la cantine pour les enfants des travailleurs",
        "les enfants de familles mono-parentales ne pouvaient accéder à la cantine",
        "la suppression des menus alternatifs exclurait une partie des élèves au nom de la laïcité",
        "il est favorable à la suppression des menus de substitutions",
      ],
      bonnesReponses: [3],
      temps: 30,
    },
    {
      // Débat 2
      gameType: GameType.Ouverte,
      questionType: QuestionType.Simple,
      reponsesPossibles: [],
      question:
        "En tant que maire, quels seraient vos arguments pour accepter ou refuser les repas de substitution ?",
      bonnesReponses: [],
      temps: 0,
    },
  ],
  viewers: [],
};
