import React, {useEffect, useState} from 'react';
import axios from "axios";
import {CircleCountDownOwn} from "./CircleCountDownOwn";

export function PumpWidget() {

    const [json, setJson] = useState([]);

    useEffect (() => {
        axios.post("http://localhost:2000/pump/timers", {duration: 55}).then(result => {
            setJson(result.data);
        });
    }, []);

    return (
        <div>
            <CircleCountDownOwn startTime={json.startDate}
                                endTime={json.endDate}/>
        </div>
    );
}
