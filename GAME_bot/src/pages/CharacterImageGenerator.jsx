import { useState } from "react";
import axios from "axios";

export default function CharacterShowcase() {
  const [prompt, setPrompt] = useState("");
  const [character, setCharacter] = useState(null);
  const [characterHistory, setCharacterHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("damage");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/generate-character", { prompt });
      setCharacter(response.data);
      setCharacterHistory((prev) => [response.data, ...prev]);
    } catch (err) {
      console.error("Error generating character:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStatBar = (label, value, color) => (
    <div className="mb-3">
      <label className="text-sm text-purple-300">{label}</label>
      <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-300`}
          style={{ width: `${value * 10}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-white px-8 py-12 font-sans">
      <div className="max-w-7xl mx-auto flex gap-10">
        {/* Left Input Area */}
        <div className="flex flex-col justify-center w-1/2 space-y-6">
          <h1 className="text-5xl font-bold text-fuchsia-500 drop-shadow-md">🪐 Space Character Forge</h1>
          <p className="text-purple-400">Describe a sci-fi hero: "Cybernetic ninja from Mars"</p>

          <input
            type="text"
            placeholder="Enter your character prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-4 text-lg rounded-xl bg-black bg-opacity-40 text-blue-100 border border-purple-500 focus:ring-2 focus:ring-fuchsia-400"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 transition-all text-white font-bold py-3 rounded-xl shadow-lg"
          >
            {loading ? "🛠️ Creating..." : "Create Character"}
          </button>
        </div>

        {/* Right Display Area */}
        {character && (
          <div className="w-1/2 bg-black bg-opacity-60 p-6 rounded-2xl shadow-2xl border border-fuchsia-500">
            <div className="text-right text-xs text-blue-300">LV. {character.stats.level || 25}</div>
            <h2 className="text-4xl font-bold text-fuchsia-400 mb-2">{character.name}</h2>

            <img
              src={character.image_url}
              alt={character.name}
              className="w-48 mx-auto rounded-lg border-4 border-fuchsia-600 mb-4"
            />

            {/* Backstory */}
            <p className="italic text-purple-300 text-sm mb-6 text-center px-2">
              {character.backstory}
            </p>

            {/* Tab Menu */}
            <div className="flex justify-around mb-4">
              {["damage", "skills", "weapons"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`uppercase text-sm px-4 py-2 rounded-full font-bold ${
                    tab === t ? "bg-fuchsia-600" : "bg-fuchsia-800 bg-opacity-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {tab === "damage" && (
              <div className="space-y-4">
                {renderStatBar("Damage", character.stats.str, "bg-blue-400")}
                {renderStatBar("Agility", character.stats.dex, "bg-blue-500")}
              </div>
            )}

            {tab === "skills" && (
              <div className="space-y-4">
                {renderStatBar("Strength", character.stats.str, "bg-pink-500")}
                {renderStatBar("Intelligence", character.stats.int, "bg-purple-500")}
                {renderStatBar("Dexterity", character.stats.dex, "bg-indigo-500")}
              </div>
            )}

            {tab === "weapons" && (
              <div className="text-purple-300 text-sm space-y-2">
                <p><strong>Weapon:</strong> Dual Wield Phasers</p>
                <p><strong>Special Ability:</strong> Fusion Thrusters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Character History */}
      {character && (
        <div className="mt-16">
          <h3 className="text-xl font-bold text-fuchsia-400 mb-3">🧬 Character History</h3>
          <div className="grid grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2">
            {characterHistory.map((char, index) => (
              <div key={index} className="bg-gray-800 bg-opacity-70 p-4 rounded-lg shadow-lg">
                <h4 className="text-lg font-semibold text-purple-200">{char.name}</h4>
                <img
                  src={char.image_url}
                  alt={char.name}
                  className="w-32 h-32 object-cover rounded-md mt-2 mb-2 border-2 border-fuchsia-400"
                />
                <p className="text-xs italic text-purple-300">{char.backstory}</p>
                <div className="text-xs text-gray-200 mt-1">
                  <p><strong>Power:</strong> {char.stats.powerLevel}</p>
                  <p><strong>STR:</strong> {char.stats.str} | <strong>INT:</strong> {char.stats.int} | <strong>DEX:</strong> {char.stats.dex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
