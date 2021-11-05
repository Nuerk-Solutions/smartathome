import React from "react";
import Sketch from "react-p5";

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;

export const props1 = null;

export function CircleCountDown({
                                       startTime = Date.now(), //startTime is basically useless
                                       fullTimeDuration = 0 * 1000, // seconds multiplied 1000
                                       endTime = startTime + fullTimeDuration,
                                       optionFullTimeCircle = true,
                                       optionSecondCircle = true,
                                       optionMinuteCircle = true,
                                       optionHourCircle = true,
                                       optionRemainingTime = true,
                                       colorFullTimeCircle = '#C89632',
                                       colorSecondCircle = '#55e155',
                                       colorMinuteCircle = '#E14141',
                                       colorHourCircle = '#5700c8',
                                       colorRemainingTime = '#ffffff'
                                   }) {

    const timeDiff = (endTime - Date.now()) / 1000;
    // console.log(timeDiff);
    let Circle = class {
        constructor(p5) {
            this.p5 = p5
            this.ang = 0
        }

        drawLine(length, rot) {
            this.p5.push()
            this.p5.rotate(rot)
            this.p5.line(0, 0, length, 0)
            this.p5.pop()
        }

        draw(width, height, start, stop) {
            if (stop > 0.0) {
                this.p5.arc(0, 0, width, height, start, stop)
            }
            this.drawLine(100 - (10 * (15 - (width / 20))), start === 0 && stop || start)
        }
    }

    let Time = class {
        constructor(p5) {
            this.oldValOne = 0
            this.oldValTwo = 0

            this.valOneAdd = 0
            this.valTwoAdd = 0
            this.p5 = p5
        }

        draw(val, xOne, xTwo) {
            let valOne = val.toString().split("")[0]
            let valTwo = val.toString().split("")[1]

            if (valOne === this.oldValOne) {
                this.valOneAdd = this.p5.lerp(this.valOneAdd, 50, .25)
            } else {
                this.valOneAdd = this.p5.lerp(this.valOneAdd, 0, .25)
            }
            this.p5.text(valOne, xOne, this.p5.height - 35 - this.valOneAdd)

            if (valTwo === this.oldValTwo) {
                this.valTwoAdd = this.p5.lerp(this.valTwoAdd, 50, .25)
            } else {
                this.valTwoAdd = this.p5.lerp(this.valTwoAdd, 0, .25)
            }
            this.p5.text(valTwo, xOne + 25, this.p5.height - 35 - this.valTwoAdd)

            this.oldValOne = valOne
            this.oldValTwo = valTwo
        }
    }

    let fullTimeCircle, secCircle, minCircle, hCircle

    function setupCircles(p5) {
        console.log("Setup Circle");
        fullTimeCircle = new Circle(p5)

        secCircle = new Circle(p5)

        minCircle = new Circle(p5)

        hCircle = new Circle(p5)
    }

    let hourTime, minTime, secTime

    function setupTime(p5) {
        console.log("Setup Time");
        hourTime = new Time(p5)

        minTime = new Time(p5)

        secTime = new Time(p5)
    }

    const setup = (p5, canvasParentRef) => {
        console.log("Setup Init");
        p5.createCanvas(400, 500).parent(canvasParentRef);
        p5.angleMode(p5.DEGREES);
        setupCircles(p5)
        setupTime(p5)
    }


    let timeSpacerAmount = 25
    let timeXStart = 105
    const draw = p5 => {
        if (minCircle === undefined || secCircle === undefined || hCircle === undefined || fullTimeCircle === undefined || hourTime === undefined || minTime === undefined || secTime === undefined) {
            setupTime(p5);
            setupCircles(p5);
        }
        let remainingTime = (endTime - Date.now()) / 1000;

        if (remainingTime <= 0) {
            remainingTime = 0
            // p5.remove();
        }
        let h = getTimeHours(remainingTime) || "0"
        let min = getTimeMinutes(remainingTime) || "0"
        let sec = getTimeMinutes(remainingTime) !== 0 ? Math.abs(getTimeSeconds(remainingTime) % 60) : Math.round(remainingTime) || "0";

        p5.clear()
        // p5.background(0)
        p5.translate(200, 200)
        p5.rotate(-90)

        p5.noFill()
        p5.strokeWeight(8)
        if (optionFullTimeCircle) {
            p5.stroke(p5.color(colorFullTimeCircle))
            let milAng = p5.map(remainingTime, 0, fullTimeDuration / 1000, 0, 360)
            fullTimeCircle.ang = p5.lerp(fullTimeCircle.ang, milAng, .1)
            fullTimeCircle.draw(300, 300, 0, milAng)
        }

        if (optionSecondCircle) {
            p5.stroke(p5.color(colorSecondCircle))
            let secAng = p5.map(sec, 0, 60, 0, 360)
            secCircle.ang = p5.lerp(secCircle.ang, secAng, .1)
            secCircle.ang = secCircle.ang < .1 && sec === "0" ? 0 : secCircle.ang
            secCircle.draw(280, 280, 0, secCircle.ang)
        }

        if (optionMinuteCircle) {
            p5.stroke(p5.color(colorMinuteCircle))
            let minAng = p5.map(min, 0, 60, 0, 360)
            minCircle.ang = p5.lerp(minCircle.ang, minAng, .1)
            minCircle.ang = minCircle.ang < .1 && min === "0" ? 0 : minCircle.ang
            minCircle.draw(260, 260, 0, minCircle.ang)
        }

        if (optionHourCircle) {
            p5.stroke(p5.color(colorHourCircle))
            let hAng = p5.map(h % 12, 0, 12, 0, 360)
            hCircle.ang = p5.lerp(hCircle.ang, hAng, .1)
            hCircle.ang = hCircle.ang < .1 && h === "0" ? 0 : hCircle.ang
            hCircle.draw(240, 240, 0, hCircle.ang)
        }

        // Middle Point
        p5.stroke(225)
        p5.point(0, 0)

        if (optionRemainingTime) {
            p5.rotate(90)
            p5.translate(-200, -200)

            p5.fill(255)
            p5.noStroke()
            p5.textAlign(p5.CENTER, p5.CENTER)
            p5.textSize(35)

            p5.fill(colorRemainingTime)
            hourTime.draw(h < 10 && "0" + h || h, timeXStart, timeXStart + timeSpacerAmount)
            p5.text(":", timeXStart + timeSpacerAmount * 2, p5.height - 90)
            p5.fill(colorRemainingTime)
            minTime.draw(min < 10 && "0" + min || min, timeXStart + timeSpacerAmount * 3, timeXStart + timeSpacerAmount * 4)
            p5.text(":", timeXStart + timeSpacerAmount * 5, p5.height - 90)
            p5.fill(colorRemainingTime)
            secTime.draw(sec < 10 && "0" + sec || sec, timeXStart + timeSpacerAmount * 6, timeXStart + timeSpacerAmount * 7)
        }
    }
    return (
        <Sketch setup={setup} draw={draw}/>
    );
}
