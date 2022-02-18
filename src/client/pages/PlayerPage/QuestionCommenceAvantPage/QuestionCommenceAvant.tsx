import { Title } from "client/components/Title/Title";
import { GameStateQuestionCommence } from "core/interfaces/GameInterfaces";
import * as React from "react";

import "./QuestionCommenceAvant.scss";

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
      <div className="questionCommenceAvantPage">
        <Title />
        <h3 className="title">{question.question}</h3>
        <h4 className="subTitle">En restauration scolaire</h4>
      </div>
    );
  }
}
