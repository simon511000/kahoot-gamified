import * as React from "react";
import { instanceOf } from "prop-types";
import { io, Socket } from "socket.io-client";
import { toast, ToastContainer, TypeOptions } from "react-toastify";
import Cookies from "universal-cookie";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../../common/interfaces/SocketIOInterfaces";
import { GameState, Player } from "../../common/interfaces/GameInterfaces";
import { RegisterPage } from "./RegisterPage";

import "react-toastify/dist/ReactToastify.css";

const ENDPOINT = "ws://127.0.0.1:3000";

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
    this.socket = io(ENDPOINT);

    this.state = {
      isLogged: false,
      playerToken: this.cookies.get("playerToken") || "",
    };

    this.handleRegister = this.handleRegister.bind(this);
    this.handleReconnect = this.handleReconnect.bind(this);
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
          this.setState({ isLogged: true, player });
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
            this.setState({ isLogged: true, player });
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

  render(): React.ReactNode {
    return (
      <div>
        {this.state.isLogged ? (
          <p>Tu es bien connecté au nom de {this.state.player!.pseudo}.</p>
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
