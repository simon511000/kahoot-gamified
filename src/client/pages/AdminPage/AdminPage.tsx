import * as React from "react";
import {
  GameState,
  GameStateJeuPasEncoreCommence,
  GameStateJeuTermine,
  GameStateQuestionCommence,
  GameStateQuestionTermine,
  Question,
} from "core/interfaces/GameInterfaces";

import "./AdminPage.scss";

type AdminPageProps = {
  gameState: GameState;
  gameStateData:
    | GameStateJeuPasEncoreCommence
    | GameStateQuestionCommence
    | GameStateQuestionTermine
    | GameStateJeuTermine;
  timer: number;
  getQuestions: () => Promise<Question[] | undefined>;
  handleStartQuestion: (questionIndex: number) => Promise<void>;
  handleStopQuestion: (questionIndex: number) => Promise<void>;
  handleFinishGame: () => Promise<void>;
  handleResetGame: () => Promise<void>;
};
type AdminPageState = {
  questions: Question[];
};

export class AdminPage extends React.Component<AdminPageProps, AdminPageState> {
  constructor(props: AdminPageProps) {
    super(props);
    this.state = {
      questions: [],
    };
  }

  componentDidMount() {
    this.getQuestions();
  }

  getQuestions(): void {
    this.props.getQuestions().then((questions) => {
      if (questions !== undefined) {
        this.setState({
          questions,
        });
      }
    });
  }

  render(): React.ReactNode {
    const { questions } = this.state;
    let etatPartie = "";
    switch (this.props.gameState) {
      case GameState.JeuPasEncoreCommence:
        etatPartie = "Pas encore commencée";
        break;
      case GameState.QuestionCommenceAvant:
        etatPartie = `Question n°${
          (this.props.gameStateData as GameStateQuestionCommence)
            .questionIndex + 1
        } démarre dans ${this.props.timer}s`;
        break;
      case GameState.QuestionCommenceApres:
        etatPartie = `Question n°${
          (this.props.gameStateData as GameStateQuestionCommence)
            .questionIndex + 1
        } en cours`;
        break;
      case GameState.QuestionTermine:
        etatPartie = "En attente d'une nouvelle question";
        break;
      case GameState.JeuTermine:
        etatPartie = "Jeu terminé";
        break;
    }

    return (
      <div className="adminPage">
        <h1>Page d'administration</h1>
        <div id="refs">
          <p>
            État de la partie : <b>{etatPartie}</b>
          </p>
          <h3>Questions :</h3>
        </div>
        <ul>
          {questions.map((question, i) => {
            const isCurrentQuestion =
              (this.props.gameState === GameState.QuestionCommenceAvant ||
                this.props.gameState === GameState.QuestionCommenceApres) &&
              (this.props.gameStateData as GameStateQuestionCommence)
                .questionIndex === i;
            const startButtonDisabled =
              this.props.gameState === GameState.QuestionCommenceAvant ||
              this.props.gameState === GameState.QuestionCommenceApres;
            const stopButtonDisabled = !isCurrentQuestion;

            return (
              <li key={i}>
                <p>
                  {i + 1}
                  {")"} {question.question}
                  <br />
                  <button
                    onClick={() => this.props.handleStartQuestion(i)}
                    disabled={startButtonDisabled}
                  >
                    Démarrer
                  </button>{" "}
                  <button
                    onClick={() => this.props.handleStopQuestion(i)}
                    disabled={stopButtonDisabled}
                  >
                    Stopper
                  </button>{" "}
                  {isCurrentQuestion && this.props.timer !== 0
                    ? this.props.timer + "s"
                    : null}
                </p>
              </li>
            );
          })}
        </ul>
        <footer>
          <button onClick={this.props.handleFinishGame}>
            Terminer la partie
          </button>{" "}
          <button onClick={this.props.handleResetGame}>
            Réinitialiser la partie
          </button>
        </footer>
      </div>
    );
  }
}
