import {
  Game,
  GameState,
  QuestionType,
  Question,
  Player,
} from "../../common/interfaces/GameInterfaces";

export class GameManager {
  game: Game;

  constructor() {
    this.game = {
      gameState: GameState.PasEncoreCommence,
      questionCourante: -1,
      joueurs: [
        {
          playerId: "fdssdffsd",
          pseudo: "simonitest",
          points: 0,
        },
      ],
      questions: [
        {
          // 1er débat
          type: QuestionType.Ouverte,
          question: "1er débat", // TODO: à compéter
          bonnesReponses: ["test"],
          temps: 0,
        },
        {
          // QCM 1
          type: QuestionType.GarsQuiBouffe,
          question:
            "Quelle est la date de la loi séparant l’Eglise et l’Etat ?",
          reponsesPossibles: [
            "19 décembre 1901",
            "9 décembre 1901",
            "29 décembre 1901",
          ],
          bonnesReponses: [], // TODO: à compéter
          temps: 30,
        },
        {
          // QCM 2
          type: QuestionType.Tables,
          question:
            "À quelle fréquence êtes-vous confronté au débat de laïcité dans le milieu scolaire ?",
          reponsesPossibles: [
            "Un peu",
            "Beaucoup",
            "Passionnément",
            "À la folie",
          ],
          bonnesReponses: [], // TODO: à compléter
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
          bonnesReponses: [], // TODO: à compéter
          temps: 30,
        },
        {
          // QCM 4
          type: QuestionType.Burger,
          question:
            "Quels sont les principes que doivent respecter les autorités en charge d’un service public ?",
          reponsesPossibles: [
            "Égalité",
            "Accessibilité",
            "Rapidité",
            "Continuité",
          ],
          bonnesReponses: [], // TODO: à compéter
          temps: 30,
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
          bonnesReponses: [], // TODO: à compéter
          temps: 30,
        },
        {
          // Débat 2
          type: QuestionType.Ouverte,
          question:
            "En tant que maire, sur quels éléments vous baseriez-vous pour accepter ou refuser les repas de substitution ?",
          bonnesReponses: [], // TODO: à compléter,
          temps: 0,
        },
      ],
    };
  }

  addPlayer(newPlayer: Player): boolean {
    // Si le pseudo existe déjà
    console.log(this.game.joueurs);
    if (
      this.game.joueurs.filter((player) => player.pseudo === newPlayer.pseudo)
        .length > 0
    ) {
      return false;
    } else {
      this.game.joueurs.push(newPlayer);
      return true;
    }
  }

  getPlayer(playerId: string): Player {
    return this.game.joueurs.filter(
      (player) => player.playerId === playerId
    )[0];
  }

  getGameState(): GameState {
    return this.game.gameState;
  }

  stopGame() {
    this.game.gameState = GameState.Termine;
  }

  nextQuestion(): GameState {
    // Si c'était la dernière question, on stop la partie
    if (this.game.questionCourante + 1 == this.game.questions.length) {
      this.stopGame();
    } else {
      this.game.questionCourante += 1;
    }

    return this.game.gameState;
  }

  getCurrentQuestion(): Question {
    return this.game.questions[this.game.questionCourante];
  }
}
