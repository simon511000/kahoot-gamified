import { GameState } from "../../../../core/interfaces/GameInterfaces";

type AdminProps = {
  gameState: GameState;
};

export function AdminPage({ gameState }: AdminProps) {
  return (
    <div>
      <h1>Page d'admin</h1>
      <p>État de la partie : {gameState.toString()}</p>
    </div>
  );
}
