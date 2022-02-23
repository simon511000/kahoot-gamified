import * as React from "react";
import { useState } from "react";
import {
  GameStateQuestionCommence,
  QuestionType,
} from "core/interfaces/GameInterfaces";

import "./OuvertGame.scss";
import { TypeOptions } from "react-toastify";

const personnages = require("./assets/personnages.gif");

type OuvertGameProps = {
  gameStateData: GameStateQuestionCommence;
  handleAnswerQuestion: (
    questionIndex: number,
    answers: number[] | string
  ) => Promise<boolean>;
  notify: (message: string, type?: TypeOptions) => void;
};
export function OuvertGame(props: OuvertGameProps) {
  const [reponse, setReponse] = useState("");

  return (
    <div className="ouvertGame">
      <img src={personnages} alt="personnages" className="personnages" />
      <textarea
        value={reponse}
        onChange={(e) => setReponse(e.target.value)}
        cols={30}
        rows={10}
      ></textarea>
      <button
        className="btn btn-done"
        onClick={() =>
          props.handleAnswerQuestion(props.gameStateData.questionIndex, reponse)
        }
      >
        Valider
      </button>
    </div>
  );
}
