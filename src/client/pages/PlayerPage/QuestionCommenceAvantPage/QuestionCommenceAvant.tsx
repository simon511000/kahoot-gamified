import { GameStateQuestionCommence } from "core/interfaces/GameInterfaces";
import * as React from "react";

type QuestionCommenceAvantPageProps = {
  gameStateData: GameStateQuestionCommence;
  timer: number;
  handleAnswerQuestion: (
    questionIndex: number,
    answers: number[] | string
  ) => Promise<boolean>;
};
type QuestionCommenceAvantPageState = {};
export class QuestionCommenceAvantPage extends React.Component<
  QuestionCommenceAvantPageProps,
  QuestionCommenceAvantPageState
> {
  render(): React.ReactNode {
    const { question, questionIndex } = this.props.gameStateData;

    return (
      <div>
        <h3>
          {questionIndex + 1}) {question.question}{" "}
          {this.props.timer !== -1 ? this.props.timer + "s" : null}
        </h3>
      </div>
    );
  }
}
