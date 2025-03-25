import React, { useState } from "react";
import CharacterSelection from "./components/CharacterSelection";
import Game from "./components/Game";

function App() {
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    return (
        <div className="app">
            {!selectedCharacter ? (
                <CharacterSelection onSelect={setSelectedCharacter} />
            ) : (
                <Game character={selectedCharacter} />
            )}
        </div>
    );
}

export default App;