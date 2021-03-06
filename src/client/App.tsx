import * as React from "react";
import { io, Socket } from "socket.io-client";
import { toast, ToastContainer, TypeOptions } from "react-toastify";
import Cookies from "universal-cookie";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "core/interfaces/SocketIOInterfaces";
import {
  GameState,
  GameStateJeuPasEncoreCommence,
  GameStateJeuTermine,
  GameStateQuestionCommence,
  GameStateQuestionTermine,
  Player,
  PlayerType,
  Question,
} from "core/interfaces/GameInterfaces";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";

import "react-toastify/dist/ReactToastify.css";
import { AdminPage } from "./pages/AdminPage/AdminPage";
import { PlayerPage } from "./pages/PlayerPage/PlayerPage";

import { ViewerPage } from "./pages/ViewerPage/ViewerPage";

import "./App.scss";

const ENDPOINT = "ws://expose.simon511000.fr:3001";

type AppProps = {};
type AppState = {
  isLogged: boolean;
  playerToken: string;
  player?: Player;
  gameState: GameState;
  gameStateData:
    | GameStateJeuPasEncoreCommence
    | GameStateQuestionCommence
    | GameStateQuestionTermine
    | GameStateJeuTermine;
  timer: number;
  viewerAnswers: { pseudo: string; answers: string[] }[];
};
export class App extends React.Component<AppProps, AppState> {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  private cookies: Cookies;

  constructor(props: AppProps) {
    super(props);
    this.cookies = new Cookies();
    this.socket = io(ENDPOINT, {
      transports: ["websocket", "polling", "flashsocket"],
    });

    this.state = {
      isLogged: false,
      playerToken: this.cookies.get("playerToken") || "",
      gameState: GameState.JeuPasEncoreCommence,
      gameStateData: {} as GameStateJeuPasEncoreCommence,
      timer: -1,
      viewerAnswers: [],
    };

    this.handleRegister = this.handleRegister.bind(this);
    this.adminGetQuestions = this.adminGetQuestions.bind(this);
    this.handleAdminStartQuestion = this.handleAdminStartQuestion.bind(this);
    this.handleAdminStopQuestion = this.handleAdminStopQuestion.bind(this);
    this.handleAdminFinishGame = this.handleAdminFinishGame.bind(this);
    this.handleAdminResetGame = this.handleAdminResetGame.bind(this);
    this.handlePlayerAnswerQuestion =
      this.handlePlayerAnswerQuestion.bind(this);
  }

  componentDidMount() {
    this.handleSocketEvents();
  }

  componentWillUnmount() {
    this.socket.off();
  }

  handleSocketEvents() {
    this.socket.on("gameStateChangeToJeuPasEncoreCommence", (gameStateData) => {
      this.handleGameStateChange(GameState.JeuPasEncoreCommence, gameStateData);
      console.log("GameState modifi?? en PasEncoreCommence", gameStateData);
    });
    this.socket.on(
      "gameStateChangeToQuestionCommenceAvant",
      (gameStateData) => {
        this.handleGameStateChange(
          GameState.QuestionCommenceAvant,
          gameStateData
        );
        console.log(
          "GameState modifi?? en QuestionCommenceAvant",
          gameStateData
        );
      }
    );
    this.socket.on(
      "gameStateChangeToQuestionCommenceApres",
      (gameStateData) => {
        this.handleGameStateChange(
          GameState.QuestionCommenceApres,
          gameStateData
        );
        this.setState({
          viewerAnswers: [],
        });
        console.log(
          "GameState modifi?? en QuestionCommenceApres",
          gameStateData
        );
      }
    );
    this.socket.on("gameStateChangeToQuestionTermine", (gameStateData) => {
      this.handleGameStateChange(GameState.QuestionTermine, gameStateData);
      this.setState({ timer: -1 });
      console.log("GameState modifi?? en QuestionTermine", gameStateData);
    });
    this.socket.on("gameStateChangeToJeuTermine", (gameStateData) => {
      this.handleGameStateChange(GameState.JeuTermine, gameStateData);
      console.log("GameState modifi?? en JeuTermine", gameStateData);
    });
    this.socket.on("timer", (timer) => {
      this.setState({ timer });
      console.log(`Timer : ${timer}`);
    });
    this.socket.on("newAnswer", (pseudo, answers) => {
      console.log("newAnswer");
      this.setState({
        viewerAnswers: [...this.state.viewerAnswers, { pseudo, answers }],
      });
    });
  }

  handleGameStateChange(
    gameState: GameState,
    gameStateData:
      | GameStateJeuPasEncoreCommence
      | GameStateQuestionCommence
      | GameStateQuestionTermine
      | GameStateJeuTermine
  ) {
    this.setState({
      gameState,
      gameStateData,
    });
  }

  notify(message: string, type: TypeOptions = "default"): void {
    toast(message, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: type,
    });
  }

  async handleRegister(pseudo: string): Promise<boolean> {
    const isLogged = await new Promise((resolve: (value: boolean) => void) =>
      this.socket.emit(
        "register",
        pseudo,
        this.cookies.get("playerToken") || "",
        (error, player) => {
          if (error === false) {
            this.onLogin(player!);
            this.cookies.set("playerToken", player!.token, { path: "/" });
            this.notify(
              `YEY! Tu t'es bien connect?? au nom de ${player!.pseudo}`,
              "success"
            );
            resolve(true);
          } else {
            this.notify(error, "error");
            resolve(false);
          }
        }
      )
    );
    return isLogged;
  }

  async onLogin(player: Player): Promise<void> {
    // On r??cup??re l'??tat de la partie
    const { gameState, gameStateData } = await new Promise(
      (
        resolve: (value: {
          gameState: GameState;
          gameStateData:
            | GameStateJeuPasEncoreCommence
            | GameStateQuestionCommence
            | GameStateQuestionTermine
            | GameStateJeuTermine;
        }) => void
      ) => {
        this.socket.emit("getGameState", (gameState, gameStateData) =>
          resolve({ gameState, gameStateData })
        );
      }
    );

    this.setState({ isLogged: true, player, gameState, gameStateData });
  }

  async adminGetQuestions(): Promise<Question[] | undefined> {
    const questions = await new Promise(
      (resolve: (questions: Question[] | undefined) => void) => {
        this.socket.emit("adminGetQuestions", (error, questions) => {
          if (error === false) {
            resolve(questions);
          } else {
            this.notify(error, "error");
            resolve(undefined);
          }
        });
      }
    );

    return questions;
  }

  async handleAdminStartQuestion(questionIndex: number): Promise<void> {
    return await new Promise((resolve: () => void) => {
      this.socket.emit("adminStartQuestion", questionIndex, (error) => {
        if (error !== false) {
          this.notify(error, "error");
        }
        resolve();
      });
    });
  }

  async handleAdminStopQuestion(questionIndex: number): Promise<void> {
    return await new Promise((resolve: () => void) => {
      this.socket.emit("adminStopQuestion", questionIndex, (error) => {
        if (error !== false) {
          this.notify(error, "error");
        }
        this.setState({ timer: -1 });
        resolve();
      });
    });
  }

  async handleAdminFinishGame(): Promise<void> {
    return await new Promise((resolve: () => void) => {
      this.socket.emit("adminFinishGame", (error) => {
        if (error !== false) {
          this.notify(error, "error");
        }
        resolve();
      });
    });
  }

  async handleAdminResetGame(): Promise<void> {
    return await new Promise((resolve: () => void) => {
      this.socket.emit("adminResetGame", (error) => {
        if (error !== false) {
          this.notify(error, "error");
        }
        resolve();
      });
    });
  }

  /**
   * @returns true si bien pris en compte, false si erreur
   */
  async handlePlayerAnswerQuestion(
    questionIndex: number,
    answers: number[] | string
  ): Promise<boolean> {
    return await new Promise((resolve: (isOk: boolean) => void) => {
      this.socket.emit("answerQuestion", questionIndex, answers, (error) => {
        console.log(error);
        if (error !== false) {
          this.notify(error, "error");
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  renderLoggedSection(playerType: PlayerType): React.ReactNode {
    let section: React.ReactNode;

    switch (playerType) {
      case PlayerType.Player:
        section = (
          <PlayerPage
            gameState={this.state.gameState}
            gameStateData={this.state.gameStateData}
            timer={this.state.timer}
            handleAnswerQuestion={this.handlePlayerAnswerQuestion}
            notify={this.notify}
          />
        );
        break;
      case PlayerType.Admin:
        section = (
          <AdminPage
            gameState={this.state.gameState}
            gameStateData={this.state.gameStateData}
            timer={this.state.timer}
            getQuestions={this.adminGetQuestions}
            handleStartQuestion={this.handleAdminStartQuestion}
            handleStopQuestion={this.handleAdminStopQuestion}
            handleFinishGame={this.handleAdminFinishGame}
            handleResetGame={this.handleAdminResetGame}
          />
        );
        break;
      case PlayerType.Viewer:
        section = (
          <ViewerPage
            gameState={this.state.gameState}
            gameStateData={this.state.gameStateData}
            timer={this.state.timer}
            answers={this.state.viewerAnswers}
          />
        );
        break;
    }

    return section;
  }

  render(): React.ReactNode {
    return (
      <>
        {this.state.isLogged ? (
          this.renderLoggedSection(this.state.player!.type)
        ) : (
          <RegisterPage handleRegister={this.handleRegister} />
        )}
        <ToastContainer />
      </>
    );
  }
}
