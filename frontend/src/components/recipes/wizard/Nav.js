import React from 'react';

const Nav = (props) => {
    const dots = [];
    for (let i = 1; i <= props.totalSteps; i += 1) {
        const isActive = props.currentStep === i;
        dots.push((
            <span
                key={`step-${i}`}
                className={`${isActive ? "text-cyan-400" : 'text-gray-600'} text-6xl mx-2`}
                onClick={() => props.goToStep(i)}
            >&bull;</span>
        ));
    }

    return (
        <div className={"flex flex-row justify-center"}>{dots}</div>
    );
};

export default Nav;
