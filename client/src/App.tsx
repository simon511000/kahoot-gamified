import * as React from "react";
import { io, Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../../common/interfaces/SocketIOInterfaces";
const ENDPOINT = "ws://127.0.0.1:3000";

export class App extends React.Component<{}, {}> {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor(props: any) {
    super(props);
    this.socket = io(ENDPOINT);

    this.register = this.register.bind(this);
  }

  register() {
    this.socket.emit("register", "simon511000", (error, player) => {
      if (error === false) {
        console.log(
          `Yey! on s'est bien inscrit, voici l'objet player :`,
          player
        );
      } else {
        console.error(`Il y a une erreur, la voici : ${error}`);
      }
    });
  }

  render(): React.ReactNode {
    return (
      <div>
        <button onClick={this.register}>Clique ici pour t'inscire</button>
      </div>
    );
  }
}
