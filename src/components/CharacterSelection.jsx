import React from "react";
import "../assets/styles.css";

const characters = [
    { id: 1, name: "Robot", image: "/images/character1.png" },
    { id: 2, name: "Nave Espacial", image: "/images/character2.png" },
    { id: 3, name: "Superhéroe", image: "/images/character3.png" },
];

const CharacterSelection = ({ onSelect }) => {
    return (
        <div className="character-selection">
            <h2>Elige tu personaje</h2>
            <div className="character-list">
                {characters.map((char) => (
                    <div key={char.id} className="character-card" onClick={() => onSelect(char)}>
                        <img src={char.image} alt={char.name} />
                        <p>{char.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CharacterSelection;