import React, {useEffect, useState} from 'react';
import axios from "axios";
import {CircleCountDownOwn} from "./CircleCountDownOwn";
import {useHistory, useLocation} from "react-router-dom";

export function PumpWidget() {

    const [json, setJson] = useState([]);
    const history = useHistory();
    const search = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(search.search)
        if (!params.get("id")) {
            axios.post("https://api.nuerk-solutions.de/pump/timers", {duration: 55}).then(result => {
                setJson(result.data);
                if (result.data) {
                    params.append("id", result.data.id)
                } else {
                    params.delete("id")
                }
                history.push({search: params.toString()})
            });
        } else {
            axios.get(`https://api.nuerk-solutions.de/pump/timers/${params.get("id")}`).then(result => {
                setJson(result.data);
            });
        }
    }, []);

    return (
        <div>
            <CircleCountDownOwn startTime={json.startDate}
                                endTime={json.endDate}
                                fullTimeDuration={json.duration}/>
        </div>
    );
}
