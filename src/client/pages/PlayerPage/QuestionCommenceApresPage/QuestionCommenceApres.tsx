import { GameStateQuestionCommence } from "core/interfaces/GameInterfaces";
import * as React from "react";

type QuestionCommenceApresPageProps = {
  gameStateData: GameStateQuestionCommence;
  timer: number;
  handleAnswerQuestion: (
    questionIndex: number,
    answers: number[] | string
  ) => Promise<boolean>;
};
type QuestionCommenceApresPageState = {};
export class QuestionCommenceApresPage extends React.Component<
  QuestionCommenceApresPageProps,
  QuestionCommenceApresPageState
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
