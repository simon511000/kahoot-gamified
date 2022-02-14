import * as React from "react";
import { io, Socket } from "socket.io-client";
import { toast, ToastContainer, TypeOptions } from "react-toastify";
import Cookies from "universal-cookie";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "core/interfaces/SocketIOInterfaces";
import { GameState, Player, Question } from "core/interfaces/GameInterfaces";
import { RegisterPage } from "./Games/Burger/pages/RegisterPage/RegisterPage";

import "react-toastify/dist/ReactToastify.css";
import { AdminPage } from "./Games/Burger/pages/AdminPage/AdminPage";
import { PlayerPage } from "./Games/Burger/pages/PlayerPage/PlayerPage";

const ENDPOINT = "ws://127.0.0.1:3001";

type AppProps = {};
type AppState = {
  isLogged: boolean;
  playerToken: string;
  player?: Player;
  gameState?: GameState;
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
    };

    this.socket.on("newQuestion", (questionIndex, question) => {
      console.log("L'admin a démarré une nouvelle question :", question);
    });

    this.socket.on("timer", (timer) => {
      console.log("Timer :", timer);
    });

    this.socket.on("questionFinished", (bonnesReponses) => {
      console.log(
        "L'admin a démarré une terminé la question. Voici les bonnes réponses",
        bonnesReponses
      );
    });

    this.handleRegister = this.handleRegister.bind(this);
    this.handleReconnect = this.handleReconnect.bind(this);
    this.adminGetQuestions = this.adminGetQuestions.bind(this);
    this.handleAdminStartQuestion = this.handleAdminStartQuestion.bind(this);
    this.handleAdminStopQuestion = this.handleAdminStopQuestion.bind(this);
    this.handleAdminFinishGame = this.handleAdminFinishGame.bind(this);
  }

  notify(message: string, type: TypeOptions = "default"): void {
    toast(message, {
      position: "top-right",
      autoClose: 5000,
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
      this.socket.emit("register", pseudo, (error, player) => {
        if (error === false) {
          this.onLogin(player!);
          this.cookies.set("playerToken", player!.token, { path: "/" });
          this.notify(
            `YEY! Tu t'es bien connecté au nom de ${player!.pseudo}`,
            "success"
          );
          resolve(true);
        } else {
          this.notify(error, "error");
          resolve(false);
        }
      })
    );
    return isLogged;
  }

  async handleReconnect(): Promise<boolean> {
    const isLogged = await new Promise((resolve: (value: boolean) => void) =>
      this.socket.emit(
        "reconnect",
        this.cookies.get("playerToken") || "",
        (error, player) => {
          if (error === false) {
            this.onLogin(player!);
            this.notify(
              `YEY! Tu t'es bien reconnecté au nom de ${player!.pseudo}`,
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
    // On récupère l'état initial de la partie
    const gameState = await new Promise(
      (resolve: (value: GameState) => void) => {
        this.socket.emit("getGameState", resolve);
      }
    );

    this.setState({ isLogged: true, player, gameState });
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

  render(): React.ReactNode {
    return (
      <div>
        {this.state.isLogged ? (
          this.state.player!.isAdmin ? (
            <AdminPage
              gameState={this.state.gameState!}
              getQuestions={this.adminGetQuestions}
              handleStartQuestion={this.handleAdminStartQuestion}
              handleStopQuestion={this.handleAdminStopQuestion}
              handleFinishGame={this.handleAdminFinishGame}
            />
          ) : (
            <PlayerPage />
          )
        ) : (
          <RegisterPage
            handleRegister={this.handleRegister}
            handleReconnect={this.handleReconnect}
          />
        )}
        <ToastContainer />
      </div>
    );
  }
}