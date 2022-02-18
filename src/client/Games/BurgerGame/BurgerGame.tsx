import * as React from "react";
import { GameStateQuestionCommence } from "core/interfaces/GameInterfaces";

import "./burger.scss";
import { TypeOptions } from "react-toastify";

const painBas = require("./assets/pain-bas.png");
const steak = require("./assets/steak.png");
const fromage = require("./assets/fromage.png");
const tomate = require("./assets/tomate.png");
const salade = require("./assets/salade.png");
const painHaut = require("./assets/pain-haut.png");

enum GarnitureType {
  PainBas,
  Steak,
  Fromage,
  Tomate,
  Salade,
  PainHaut,
}

type BurgerGameProps = {
  gameStateData: GameStateQuestionCommence;
  handleAnswerQuestion: (
    questionIndex: number,
    answers: number[] | string
  ) => Promise<boolean>;
  notify: (message: string, type?: TypeOptions) => void;
};
type BurgerGameState = {
  garnitures: GarnitureType[];
};
export class BurgerGame extends React.Component<
  BurgerGameProps,
  BurgerGameState
> {
  constructor(props: BurgerGameProps) {
    super(props);
    this.state = { garnitures: [] };

    this.handleAddGarniture = this.handleAddGarniture.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleAddGarniture(type: GarnitureType): void {
    const { notify } = this.props;
    const garnitures = this.state.garnitures.slice();
    // Si la garniture n'a pas déjà été placé
    if (!garnitures.includes(type)) {
      // Si le joueur essaye de placer une garniture sans pain du bas
      if (
        type === GarnitureType.PainBas ||
        garnitures.includes(GarnitureType.PainBas)
      ) {
        // Si le joueur essaye de placer une garniture au dessus d'un pain du haut
        if (!garnitures.includes(GarnitureType.PainHaut)) {
          // On place la garniture
          garnitures.push(type);
          this.setState({
            garnitures,
          });
        } else {
          notify(
            "Vous ne pouvais pas placer de garniture au dessus du pain du haut",
            "error"
          );
        }
      } else {
        notify(
          "Veuillez placer le pain de bas avant de mettre une garniture",
          "error"
        );
      }
    } else {
      notify("Cette garniture a déjà été placé", "error");
    }
  }

  handleReset(): void {
    this.setState({ garnitures: [] });
  }

  renderGarniture(type: GarnitureType, key: React.Key): React.ReactNode {
    let garnitureElement: React.ReactNode;

    switch (type) {
      case GarnitureType.PainBas:
        garnitureElement = <img src={painBas} alt="Pain Bas" key={key} />;
        break;
      case GarnitureType.Steak:
        garnitureElement = <img src={steak} alt="Steak" key={key} />;
        break;
      case GarnitureType.Fromage:
        garnitureElement = <img src={fromage} alt="Fromage" key={key} />;
        break;
      case GarnitureType.Tomate:
        garnitureElement = <img src={tomate} alt="Tomate" key={key} />;
        break;
      case GarnitureType.Salade:
        garnitureElement = <img src={salade} alt="Salade" key={key} />;
        break;
      case GarnitureType.PainHaut:
        garnitureElement = <img src={painHaut} alt="Pain Haut" key={key} />;
        break;
    }

    return garnitureElement;
  }

  render(): React.ReactNode {
    const { question, questionIndex } = this.props.gameStateData;

    return (
      <div className="burger-game">
        <div id="buttons-container">
          <button
            className="btn"
            onClick={() => this.handleAddGarniture(GarnitureType.PainBas)}
          >
            Pain Bas
          </button>
          <button
            className="btn"
            onClick={() => this.handleAddGarniture(GarnitureType.Steak)}
          >
            Steak
          </button>
          <button
            className="btn"
            onClick={() => this.handleAddGarniture(GarnitureType.Fromage)}
          >
            Fromage
          </button>
          <button
            className="btn"
            onClick={() => this.handleAddGarniture(GarnitureType.Tomate)}
          >
            Tomate
          </button>
          <button
            className="btn"
            onClick={() => this.handleAddGarniture(GarnitureType.Salade)}
          >
            Salade
          </button>
          <button
            className="btn"
            onClick={() => this.handleAddGarniture(GarnitureType.PainHaut)}
          >
            Pain Haut
          </button>
          <div className="btn btn-delete" onClick={this.handleReset}>
            Réinitialiser
          </div>
        </div>
        <div id="burger-container">
          {this.state.garnitures.map((garniture, i) => (
            <div className="cushined flattened">
              <div className="garniture">
                {this.renderGarniture(garniture, i)}
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-done">Valider</button>
      </div>
    );
  }
}
