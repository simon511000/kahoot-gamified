import * as React from "react";
import { GameState, Question } from "core/interfaces/GameInterfaces";

type AdminProps = {
  gameState: GameState;
  getQuestions: () => Promise<Question[] | undefined>;
  handleStartQuestion: (questionIndex: number) => Promise<void>;
  handleStopQuestion: (questionIndex: number) => Promise<void>;
  handleFinishGame: () => Promise<void>;
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

    return (
      <div>
        <h1>Page d'administration</h1>
        <h3>Questions :</h3>
        <ul>
          {questions.map((question, i) => (
            <li key={i}>
              <p>
                {question.question}
                <br />
                <button onClick={() => this.props.handleStartQuestion(i)}>
                  Démarrer
                </button>{" "}
                <button onClick={() => this.props.handleStopQuestion(i)}>
                  Stopper
                </button>
              </p>
            </li>
          ))}
        </ul>
        <button onClick={this.props.handleFinishGame}>
          Terminer la partie
        </button>
      </div>
    );
  }
}
