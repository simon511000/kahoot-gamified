import crypto from "crypto";
import { initialGame } from "./initialGame";

import {
  Game,
  GameState,
  Question,
  Player,
  GameStateJeuPasEncoreCommence,
  GameStateQuestionCommence,
  GameStateJeuTermine,
  GameStateQuestionTermine,
  PlayerType,
} from "../core/interfaces/GameInterfaces";

export class GameManager {
  game: Game;

  constructor() {
    this.game = { ...initialGame };
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
      if (newPlayer.type === PlayerType.Viewer) {
        this.game.viewers.push(newPlayer.playerId);
      }
      return true;
    }
  }

  getPlayer(playerId: string): Player | undefined {
    return this.game.joueurs.filter(
      (player) => player.playerId === playerId
    )[0];
  }

  getGameState() {
    return this.game.gameState;
  }

  getGameStateData() {
    return this.game.gameStateData;
  }

  setGameState(
    gameState: GameState,
    gameStateData:
      | GameStateJeuPasEncoreCommence
      | GameStateQuestionCommence
      | GameStateQuestionTermine
      | GameStateJeuTermine
  ) {
    this.game = {
      ...this.game,
      gameState,
      gameStateData,
    };
  }

  stopGame() {
    this.setGameState(GameState.JeuTermine, <GameStateJeuTermine>{});
  }

  getCurrentIndexQuestion(): number {
    return this.game.gameState === GameState.QuestionCommenceAvant ||
      this.game.gameState === GameState.QuestionCommenceApres
      ? (<GameStateQuestionCommence>this.game.gameStateData).questionIndex
      : -1;
  }

  reconnectWithToken(token: string, playerId: string): Player | boolean {
    const playersWithSameToken = this.game.joueurs.filter(
      (player) => player.token === token
    );
    if (playersWithSameToken.length > 0) {
      const player = playersWithSameToken[0];
      player.playerId = playerId;
      return player;
    } else {
      return false;
    }
  }

  getPlayerType(pseudo: string): PlayerType {
    let playerType: PlayerType;
    const pseudoHashed = crypto
      .createHash("sha256")
      .update(pseudo)
      .digest("hex");

    switch (pseudoHashed) {
      case "d1a59cef8a6b1664139227304c615b179e8bb2b3d98cd24a5661a1db0849e9a7":
        playerType = PlayerType.Admin;
        break;
      case "6978a7936cea592675c0f0a2cf6e5e429851d5f158c62f21e6784c02634787b4":
        playerType = PlayerType.Viewer;
        break;
      default:
        playerType = PlayerType.Player;
        break;
    }

    return playerType;
  }

  getQuestions(): Question[] {
    return this.game.questions;
  }

  getBonnesReponses(questionIndex: number): number[] {
    return this.game.questions[questionIndex].bonnesReponses;
  }

  setTimer(timerInterval: NodeJS.Timer): void {
    this.game.timerInterval = timerInterval;
  }

  getTimer(): NodeJS.Timer | undefined {
    return this.game.timerInterval;
  }

  hasAlreadyAnswered(playerId: string, questionIndex: number): boolean {
    return this.getPlayer(playerId)!.questionsRepondues.includes(questionIndex);
  }

  isAnswersCorrect(questionIndex: number, answers: number[]): boolean {
    const question = this.game.questions[questionIndex];
    const reponsesPossibles = question.reponsesPossibles;
    const bonnesReponses = question.bonnesReponses;
    let isCorrect = true;
    let i = 0;
    if (question.reponsesPossibles === undefined) return false;
    while (isCorrect && i < question.reponsesPossibles.length) {
      const reponsePossible = question.reponsesPossibles[i];
      // Si la réponse est vrai
      if (bonnesReponses.includes(i)) {
        // Si le joueur a répondu faux, c'est incorrect
        if (!answers.includes(i)) {
          isCorrect = false;
        }
      } else {
        // Si le joueur a répondu vrai, c'est incorrect
        if (answers.includes(i)) {
          isCorrect = false;
        }
      }
      i++;
    }

    return isCorrect;
  }

  addPoint(playerId: string): void {
    const player = this.getPlayer(playerId);
    player!.points++;
  }

  addAnswered(playerId: string, questionIndex: number): void {
    const player = this.getPlayer(playerId);
    player!.questionsRepondues.push(questionIndex);
  }

  resetGame(): void {
    this.game = { ...initialGame };
  }
}
