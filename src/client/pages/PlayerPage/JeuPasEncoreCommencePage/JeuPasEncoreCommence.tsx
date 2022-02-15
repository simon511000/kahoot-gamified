import { GameStateJeuPasEncoreCommence } from "core/interfaces/GameInterfaces";
import * as React from "react";

type JeuPasEncoreCommencePageProps = {
  gameStateData: GameStateJeuPasEncoreCommence;
};
type JeuPasEncoreCommencePageState = {};
export class JeuPasEncoreCommencePage extends React.Component<
  JeuPasEncoreCommencePageProps,
  JeuPasEncoreCommencePageState
> {
  render(): React.ReactNode {
    return <p>Le jeu n'a pas encore commencé</p>;
  }
}
