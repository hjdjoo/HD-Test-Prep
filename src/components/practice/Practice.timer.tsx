import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react"
import styles from "./Practice.module.css"

interface TimerProps {
  start: boolean
  submitStatus: "waiting" | "submitting" | "submitted"
  time: number,
  setTime: Dispatch<SetStateAction<number>>
}

export default function Timer(props: TimerProps) {

  const { start, submitStatus, time, setTime } = props;

  const [timerOn, setTimerOn] = useState<boolean>(false);
  const timerInterval = useRef<NodeJS.Timeout>()

  const [timerMessage, setTimerMessage] = useState<string>("")

  useEffect(() => {

    console.log("Timer.tsx/useEffect")
    console.log("start: ", start)

    if (!start || timerInterval.current) {
      return;
    };

    setTime(0);
    startTimer();

  }, [start])

  useEffect(() => {

    if (submitStatus !== "waiting") {
      stopTimer();
    }

  }, [submitStatus])


  function startTimer() {

    console.log("starting timer...")

    if (timerOn) {
      console.log("timer is on, returning")
      return
    };

    const newInterval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    setTimerOn(true);
    // setTimerInterval(newInterval);
    timerInterval.current = newInterval;

  }

  function stopTimer() {

    console.log("stopping timer - setting timerOn false and clearing interval...")

    setTimerOn(false)
    clearInterval(timerInterval.current)

  }

  const displayTime = () => {

    const sec = time % 60;
    const min = Math.floor(time / 60);

    const displaySecs = sec < 10 ? `0${sec}` : `${sec}`;
    const displayMins = min < 10 ? `0${min}` : `${min}`

    return `${displayMins}:${displaySecs}`

  }

  // const timedMessage = () => {

  //   if (time < 15) {
  //     setTimerMessage("Read and plan!")
  //   }
  //   if (time > 20 && time < 45) {
  //     setTimerMessage("Work!")
  //   }

  // }


  return (
    <div id="timer">
      <div id="time-display" className={[
        styles.alignTimer
      ].join(" ")}>
        <p>{`${displayTime()}`}</p>
      </div>
      <button onClick={startTimer}>start</button>
      <button onClick={stopTimer}>pause</button>
    </div>
  )
}