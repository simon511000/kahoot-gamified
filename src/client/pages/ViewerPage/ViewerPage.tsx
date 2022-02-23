import {
  GameState,
  GameStateJeuPasEncoreCommence,
  GameStateJeuTermine,
  GameStateQuestionCommence,
  GameStateQuestionTermine,
} from "core/interfaces/GameInterfaces";
import * as React from "react";

type ViewerPageProps = {
  gameState: GameState;
  gameStateData:
    | GameStateJeuPasEncoreCommence
    | GameStateQuestionCommence
    | GameStateQuestionTermine
    | GameStateJeuTermine;
  timer: number;
  answers: { pseudo: string; answers: string[] }[];
};
type ViewerPageState = {};
export class ViewerPage extends React.Component<
  ViewerPageProps,
  ViewerPageState
> {
  constructor(props: ViewerPageProps) {
    super(props);
  }

  render(): React.ReactNode {
    const { gameState, gameStateData, timer, answers } = this.props;
    console.log(answers);

    if (gameState === GameState.QuestionCommenceApres) {
      return (
        <div>
          <h1>
            {(gameStateData as GameStateQuestionCommence).question.question}{" "}
            {timer > 0 ? `(${timer}s)` : null}
          </h1>
          <ul>
            {answers.map((answer, i) => (
              <li key={i}>
                <b>{answer.pseudo}</b> :{" "}
                <ul>
                  {answer.answers.map((answer) => (
                    <li key={i}>{answer}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return <p>En attente...</p>;
  }
}
