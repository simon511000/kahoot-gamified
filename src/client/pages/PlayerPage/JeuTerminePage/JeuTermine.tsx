import { GameStateJeuTermine } from "core/interfaces/GameInterfaces";
import * as React from "react";

type JeuTerminePageProps = {
  gameStateData: GameStateJeuTermine;
};
type JeuTerminePageState = {};
export class JeuTerminePage extends React.Component<
  JeuTerminePageProps,
  JeuTerminePageState
> {
  render(): React.ReactNode {
    return <p>Le jeu est terminé</p>;
  }
}
