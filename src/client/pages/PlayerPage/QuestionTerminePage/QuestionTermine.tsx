import { GameStateQuestionTermine } from "core/interfaces/GameInterfaces";
import * as React from "react";

type QuestionTerminePageProps = {
  gameStateData: GameStateQuestionTermine;
};
type QuestionTerminePageState = {};
export class QuestionTerminePage extends React.Component<
  QuestionTerminePageProps,
  QuestionTerminePageState
> {
  render(): React.ReactNode {
    return <p>En attente d'une nouvelle question</p>;
  }
}
