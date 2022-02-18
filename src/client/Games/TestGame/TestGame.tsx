import { GameStateQuestionCommence } from "core/interfaces/GameInterfaces";
import * as React from "react";

type TestGameProps = {
  gameStateData: GameStateQuestionCommence;
  handleAnswerQuestion: (
    questionIndex: number,
    answers: number[] | string
  ) => Promise<boolean>;
};
type TestGameState = {
  reponses: number[];
};
export class TestGame extends React.Component<TestGameProps, TestGameState> {
  constructor(props: TestGameProps) {
    super(props);
    this.state = { reponses: [] };

    this.handleQCMAnswer = this.handleQCMAnswer.bind(this);
  }

  handleQCMAnswer(answer: number) {
    const currentReponses = this.state.reponses.slice();
    currentReponses.push(answer);
    this.setState({ reponses: currentReponses });
  }

  render(): React.ReactNode {
    const { question, questionIndex } = this.props.gameStateData;

    return (
      <div>
        <ul>
          {question.reponsesPossibles.length > 0
            ? question.reponsesPossibles.map((reponse, i) => (
                <button key={i} onClick={() => this.handleQCMAnswer(i)}>
                  {reponse}
                </button>
              ))
            : null}
        </ul>
        <button
          onClick={() =>
            this.props.handleAnswerQuestion(questionIndex, this.state.reponses)
          }
        >
          Valider
        </button>
      </div>
    );
  }
}
