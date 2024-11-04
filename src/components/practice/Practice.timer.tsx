import { useState, useEffect, useRef } from "react"

interface TimerProps {
  start: boolean
}

export default function Timer(props: TimerProps) {

  const { start } = props;

  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  const startTime = useRef(Date.now());

  function getTime() {

    // console.log(start.current);

    const time = Date.now() - startTime.current;

    const showMinutes = String(Math.floor((time / 1000 / 60) % 60));
    const showSeconds = String(Math.floor((time / 1000) % 60));

    if (String(showMinutes).length < 2) {
      setMinutes(`0${showMinutes}`)
    } else {
      setMinutes(showMinutes)
    };

    if (String(showSeconds).length < 2) {
      setSeconds(`0${showSeconds}`)
    } else {
      setSeconds(showSeconds);
    };

  }

  useEffect(() => {

    if (!start) return;

    startTime.current = Date.now();

    const interval = setInterval(() => {
      getTime();
    }, 1000);

    () => {
      clearInterval(interval);
    }

  }, [start])

  return (
    <div id="timer">
      <p>{`${minutes}:${seconds}`}</p>
    </div>
  )
}