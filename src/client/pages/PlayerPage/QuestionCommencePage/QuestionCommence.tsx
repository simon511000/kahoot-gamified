import { GameStateQuestionCommence } from "core/interfaces/GameInterfaces";
import * as React from "react";

type QuestionCommencePageProps = {
  gameStateData: GameStateQuestionCommence;
};
type QuestionCommencePageState = {};
export class QuestionCommencePage extends React.Component<
  QuestionCommencePageProps,
  QuestionCommencePageState
> {
  render(): React.ReactNode {
    return <p>La question a commencé</p>;
  }
}
