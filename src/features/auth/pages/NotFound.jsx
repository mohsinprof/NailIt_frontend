import { useState } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  // 1. React State: Generate a random number between 1 and 100
  // We use a function inside useState so it only generates the number ONCE when the page loads
  const [secretNumber, setSecretNumber] = useState(() => Math.floor(Math.random() * 99) + 1);
  
  // 2. React State: What the user types in the box
  const [userGuess, setUserGuess] = useState("");
  
  // 3. React State: The message telling them if they are right/wrong
  const [message, setMessage] = useState("I'm thinking of a number between 1 and 100...");

  // The function that runs when they click "Guess!"
  const checkGuess = (e) => {
    e.preventDefault(); // SUPER IMPORTANT: Stops the page from refreshing when you submit the form
    
    const guess = parseInt(userGuess); // Turn text into a real number

    if (guess === secretNumber) {
      setMessage("🎉 CORRECT! You won the 404 game!");
    } else if (guess > secretNumber) {
      setMessage("📉 Too High! Try again.");
    } else {
      setMessage("📈 Too Low! Try again.");
    }
    
    setUserGuess(""); // Clear the input box for the next guess
  };

  // Function to restart the game with a new number
  const resetGame = () => {
    setSecretNumber(Math.floor(Math.random() * 99) + 1);
    setMessage("I'm thinking of a number between 1 and 100...");
    setUserGuess("");
  };

  return (
    <div style={{ textAlign: "center", padding: "50px", fontFamily: "sans-serif" }}>
      <h1>404 - Lost in Space! 🚀</h1>
      <p>The page you are looking for doesn't exist.</p>
      <p>Since you're stuck here, want to play a quick game?</p>

      {/* The Game Box */}
      <div style={{ 
        margin: "30px auto", 
        maxWidth: "350px", 
        padding: "20px", 
        border: "2px dashed #ccc", 
        borderRadius: "10px",
        backgroundColor: "#000000"
      }}>
        <p><strong>{message}</strong></p>

        {/* The Form */}
        <form onSubmit={checkGuess}>
          <input
            type="number"
            min="1"
            max="100"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            required
            style={{ padding: "10px", fontSize: "16px", width: "70%", marginRight: "10px", color:"black"}}
          />
          <button 
            type="submit" 
            style={{ padding: "10px", fontSize: "16px", cursor: "pointer",color:"black" }}
          >
            Guess!
          </button>
        </form>

        <br />
        <button onClick={resetGame} style={{ padding: "5px 15px", cursor: "pointer", color:"black" }}>
          Reset Game
        </button>
      </div>

      {/* Link back to home */}
      <Link to="/" style={{ fontSize: "20px", color: "blue", textDecoration: "none" }}>
        ← Go Back to Safety (Home)
      </Link>
    </div>
  );
}