export const isEven = index => index % 2 === 0;

export const mToK = speed => {
    return Math.round(speed * 1.6)
}

export const kToM = speed => {
    return Math.round(speed * 0.6)
}

export const fToC = temp => {
    return Math.round(((temp - 32) * 5) / 9)
}

export const cToF = temp => {
    return Math.round((temp * 9) / 5 + 32)
}
