import { BurgerGame } from "client/Games/BurgerGame/BurgerGame";
import { TestGame } from "client/Games/TestGame/TestGame";
import {
  GameStateQuestionCommence,
  QuestionType,
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

    switch (this.props.gameStateData.question.type) {
      case QuestionType.Burger:
        game = (
          <BurgerGame
            gameStateData={this.props.gameStateData}
            handleAnswerQuestion={this.props.handleAnswerQuestion}
            notify={this.props.notify}
          />
        );
        break;

      default:
        game = (
          <TestGame
            gameStateData={this.props.gameStateData}
            handleAnswerQuestion={this.props.handleAnswerQuestion}
          />
        );
        break;
    }

    return game;
  }

  render(): React.ReactNode {
    const { question, questionIndex } = this.props.gameStateData;

    return <div>{this.renderGame()}</div>;
  }
}
