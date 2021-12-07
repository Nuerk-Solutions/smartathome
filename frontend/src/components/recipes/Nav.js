import React from 'react';

const Nav = (props) => {
    const dots = [];
    for (let i = 1; i <= props.totalSteps; i += 1) {
        const isActive = props.currentStep === i;
        dots.push((
            <span
                key={`step-${i}`}
                className={`${isActive ? "bg-green" : 'bg-red'}`}
                onClick={() => props.goToStep(i)}
            >&bull;</span>
        ));
    }

    return (
        <div>{dots}</div>
    );
};

export default Nav;
