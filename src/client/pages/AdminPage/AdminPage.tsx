import * as React from "react";
import {
  GameState,
  GameStateJeuPasEncoreCommence,
  GameStateJeuTermine,
  GameStateQuestionCommence,
  GameStateQuestionTermine,
  Question,
} from "core/interfaces/GameInterfaces";

type AdminProps = {
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
type AdminState = {
  questions: Question[];
};

export class AdminPage extends React.Component<AdminProps, AdminState> {
  constructor(props: AdminProps) {
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
        etatPartie = "Pas encore commencé";
        break;
      case GameState.QuestionCommence:
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
      <div>
        <h1>Page d'administration</h1>
        <p>
          État de la partie : <b>{etatPartie}</b>
        </p>
        <h3>Questions :</h3>
        <ul>
          {questions.map((question, i) => {
            const isCurrentQuestion =
              this.props.gameState === GameState.QuestionCommence &&
              (this.props.gameStateData as GameStateQuestionCommence)
                .questionIndex === i;
            const startButtonDisabled =
              this.props.gameState === GameState.QuestionCommence;
            const stopButtonDisabled = !isCurrentQuestion;

            return (
              <li key={i}>
                <p>
                  {i + 1}) {question.question}
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
                  {isCurrentQuestion && this.props.timer !== -1
                    ? this.props.timer + "s"
                    : null}
                </p>
              </li>
            );
          })}
        </ul>
        <button onClick={this.props.handleFinishGame}>
          Terminer la partie
        </button>{" "}
        <button onClick={this.props.handleResetGame}>
          Réinitialiser la partie
        </button>
      </div>
    );
  }
}
