import React, {useEffect, useState} from 'react';
import Countdown from "react-countdown";

export default () => {
    const [time, setTime] = useState(5);
    const [dateTime, setDateTime] = useState(Date.now() + time * 60000);
    const [state, setState] = useState(false);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const Completionist = () => <span>You are good to go! </span>;

    const handleResetClick = () => {
        setDateTime(Date.now() + ((time - 1) * 60000));
    };

    useEffect(() => {
        const pumpState = state ? 'On' : 'Off'

        fetch(`http://87.187.220.123/pump/${pumpState}`)
            .then(result => result.json())
            .then(result => {
                    setIsLoaded(true);
                    console.log(result);
                },
                (error) => {
                    setError(error);
                    console.log(error);
                    setIsLoaded(true);
                });
    }, [state]);

    const renderer = ({api, hours, minutes, seconds, completed}) => {
        if (completed) {
            setState(false)
            return <Completionist/>;
        } else {
            // Render a countdown
            return (
                <div>
                    <span>{hours}:{minutes}:{seconds}</span>
                    <div>
                        <button onClick={() => {
                            api.start();
                            setState(true);
                        }} disabled={api.isStarted() || completed}>
                            Start
                        </button>
                        {" "}
                        <button
                            onClick={() => {
                                api.pause();
                                setState(false);
                            }}
                            disabled={api.isPaused() || api.isStopped() || completed}
                        >
                            Pause
                        </button>
                        {" "}
                        <button onClick={() => {
                            api.stop();
                            setState(false);
                        }} disabled={api.isStopped()}>
                            Stop
                        </button>
                        {" "}
                        <button onClick={handleResetClick}>Reset</button>
                    </div>
                </div>
            );
        }
    };
    return (
        <div>
            <input type={"Number"} value={time} onInput={e => {
                setTime(e.target.value)
                handleResetClick();
            }}/>
            <Countdown
                date={dateTime}
                autoStart={false}
                renderer={renderer}
            />
        </div>
    );
}

