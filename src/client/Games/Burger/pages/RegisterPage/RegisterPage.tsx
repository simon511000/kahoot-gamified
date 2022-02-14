import { useState } from "react";

type RegisterPageProps = {
  handleRegister: (pseudo: string) => Promise<boolean>;
  handleReconnect: () => Promise<boolean>;
};
export function RegisterPage({
  handleRegister,
  handleReconnect,
}: RegisterPageProps) {
  const [pseudo, setPseudo] = useState("");

  return (
    <div>
      <h1>Page d'inscription</h1>
      <label htmlFor="pseudo">Pseudo : </label>
      <input
        type="text"
        name="pseudo"
        id="pseudo"
        value={pseudo}
        onChange={(event) => setPseudo(event.target.value)}
      />
      <button onClick={() => handleRegister(pseudo)}>S'inscrire</button>
      <button onClick={handleReconnect}>Se reconnecter</button>
    </div>
  );
}
