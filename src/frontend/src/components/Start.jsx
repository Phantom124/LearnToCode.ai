import { Play } from "lucide-react";

export default function Start({ onStart }) {
  return (
    <div className="start-screen">
      <h1 className="title">AI Coding Quiz Game</h1>
      <p className="subtitle">Test your programming knowledge!</p>
      <button onClick={onStart} className="start-btn">
        <Play className="icon" />
        Start Quiz
      </button>
    </div>
  );
}
