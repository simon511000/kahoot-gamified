import { BurgerGame } from "client/Games/BurgerGame/BurgerGame";
import { OuvertGame } from "client/Games/OuvertGame/OuvertGame";
import {
  GameStateQuestionCommence,
  GameType,
} from "core/interfaces/GameInterfaces";
import * as React from "react";
import { TypeOptions } from "react-toastify";

type QuestionCommenceApresPageProps = {
  gameStateData: GameStateQuestionCommence;
  timer: number;
  handleAnswerQuestion: (
    questionIndex: number,
    answers: number[] | string
  ) => Promise<boolean>;
  notify: (message: string, type?: TypeOptions) => void;
};
type QuestionCommenceApresPageState = {};
export class QuestionCommenceApresPage extends React.Component<
  QuestionCommenceApresPageProps,
  QuestionCommenceApresPageState
> {
  renderGame(): React.ReactNode {
    let game;

    switch (this.props.gameStateData.question.gameType) {
      case GameType.Burger:
        game = (
          <BurgerGame
            gameStateData={this.props.gameStateData}
            handleAnswerQuestion={this.props.handleAnswerQuestion}
            notify={this.props.notify}
            timer={this.props.timer}
          />
        );
        break;
      case GameType.Ouverte:
        game = (
          <OuvertGame
            gameStateData={this.props.gameStateData}
            handleAnswerQuestion={this.props.handleAnswerQuestion}
            notify={this.props.notify}
          />
        );
        break;
    }

    return game;
  }

  render(): React.ReactNode {
    return <div>{this.renderGame()}</div>;
  }
}
