import React, { useState } from "react";
import "../assets/styles.css";

const Game = ({ character }) => {
    const [points, setPoints] = useState(0);
    const nextLevel = 10;

    return (
        <div className="game">
            <h2>Bienvenido, {character.name}!</h2>
            <img src={character.image} alt={character.name} className="game-character" />
            <p>Puntos: {points}</p>
            <button onClick={() => setPoints(points + 1)}>Sumar Punto</button>
            {points >= nextLevel && <p>¡Felicidades! Has subido de nivel 🎉</p>}
        </div>
    );
};

export default Game;