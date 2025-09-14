import { TimerIcon } from "lucide-react";


const Timer = ({ timeLeft})  => {
  return (
        <div className="timer">
            <TimerIcon className="timer-icon" />
            <span className="timer-text">{timeLeft}s</span>
        </div>
  );
}

export default  Timer;