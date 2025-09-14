import { Trophy } from "lucide-react";

const GameOver = ({ onRestart, score, totalQuestions }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="game-over">
      <Trophy className="game-over-icon" />
      <h2 className="game-over-title">Game Over!</h2>
      <p className="game-over-score">
        Final Score: {score}/{totalQuestions}
      </p>
      <p className="game-over-percentage">({percentage}% correct)</p>
      <button onClick={onRestart} className="game-over-button">
        Play Again
      </button>
    </div>
  );
}

export default GameOver;
