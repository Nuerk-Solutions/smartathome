import React from "react";
import {CircleCountDownOwn} from "./CircleCountDownOwn";

export default function () {
    return <div>
        <CircleCountDownOwn startTime={Date.now() / 1000}
                            endTime={Date.now() / 1000 + 60}/>
    </div>
}
