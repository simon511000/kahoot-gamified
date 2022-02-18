import { Title } from "client/components/Title/Title";
import { useState } from "react";

import "./RegisterPage.scss";

type RegisterPageProps = {
  handleRegister: (pseudo: string) => Promise<boolean>;
};
export function RegisterPage({ handleRegister }: RegisterPageProps) {
  const [pseudo, setPseudo] = useState("");

  return (
    <div className="registerPage">
      <div className="registerPage__names">
        <p className="registerPage__name">Baser Zerha</p>
        <p className="registerPage__name">Ledoux Jeanne</p>
      </div>
      <div className="registerPage__center">
        <Title />
        <h1 className="registerPage__center__title">
          En restauration scolaire
        </h1>
        <div className="registerPage__center__barre"></div>
        <h3 className="subtitle">Séance 3</h3>
        <form
          className="registerPage__center__pseudo"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister(pseudo);
          }}
        >
          <label
            htmlFor="pseudo"
            className="registerPage__center__pseudo__label"
          >
            Pseudo
          </label>
          <input
            type="text"
            name="pseudo"
            id="pseudo"
            className="registerPage__center__pseudo__input"
            value={pseudo}
            onChange={(event) => setPseudo(event.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
