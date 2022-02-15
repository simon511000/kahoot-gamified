import {
  GameState,
  GameStateJeuPasEncoreCommence,
  GameStateJeuTermine,
  GameStateQuestionCommence,
  GameStateQuestionTermine,
} from "core/interfaces/GameInterfaces";
import * as React from "react";
import { JeuPasEncoreCommencePage } from "./JeuPasEncoreCommencePage/JeuPasEncoreCommence";
import { JeuTerminePage } from "./JeuTerminePage/JeuTermine";
import { QuestionCommencePage } from "./QuestionCommencePage/QuestionCommence";
import { QuestionTerminePage } from "./QuestionTerminePage/QuestionTermine";

type PlayerPageProps = {
  gameState: GameState;
  gameStateData:
    | GameStateJeuPasEncoreCommence
    | GameStateQuestionCommence
    | GameStateQuestionTermine
    | GameStateJeuTermine;
  timer: number;
};
type PlayerPageState = {};
export class PlayerPage extends React.Component<
  PlayerPageProps,
  PlayerPageState
> {
  constructor(props: PlayerPageProps) {
    super(props);
  }

  renderPage(): React.ReactNode {
    let page: React.ReactNode = undefined;

    switch (this.props.gameState) {
      case GameState.JeuPasEncoreCommence:
        page = (
          <JeuPasEncoreCommencePage
            gameStateData={
              this.props.gameStateData as GameStateJeuPasEncoreCommence
            }
          />
        );
        break;
      case GameState.QuestionCommence:
        page = (
          <QuestionCommencePage
            gameStateData={
              this.props.gameStateData as GameStateQuestionCommence
            }
          />
        );
        break;
      case GameState.QuestionTermine:
        page = (
          <QuestionTerminePage
            gameStateData={this.props.gameStateData as GameStateQuestionTermine}
          />
        );
        break;
      case GameState.JeuTermine:
        page = (
          <JeuTerminePage
            gameStateData={this.props.gameStateData as GameStateJeuTermine}
          />
        );
        break;
    }

    return page;
  }

  render(): React.ReactNode {
    return (
      <div>
        <h1>Page de l'utilisateur</h1>
        {this.renderPage()}
      </div>
    );
  }
}
