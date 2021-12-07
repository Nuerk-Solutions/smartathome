import React, {Fragment, useEffect, useState} from "react"
import StepWizard from "react-step-wizard";

import Nav from './Nav';
import {LinearProgress} from "@mui/material";

export default function RecipeWizard() {

    const [state, updateState] = useState({
        form: {},
        demo: true, // uncomment to see more
    });

    const updateForm = (key, value) => {
        const {form} = state;

        form[key] = value;
        updateState({
            ...state,
            form,
        });
    };

    // Do something on step change
    const onStepChange = (stats) => {
        console.log(stats);
    };

    const setInstance = SW => updateState({
        ...state,
        SW,
    });

    const {SW, demo} = state;

    return (
        <div className='container'>
            <h3>React Step Wizard</h3>
            <div className={'jumbotron'}>
                <div className='row'>
                    <div className={`col-12 col-sm-6 offset-sm-3`}>
                        <StepWizard
                            onStepChange={onStepChange}
                            isHashEnabled
                            nav={<Nav/>}
                        >
                            <First hashKey={'FirstStep'} update={updateForm}/>
                            <Second form={state.form}/>
                            <Progress stepName='progress'/>
                            {null /* will be ignored */}
                            <Last hashKey={'TheEnd!'}/>
                        </StepWizard>
                    </div>
                </div>
            </div>
            {(demo && SW) && <InstanceDemo SW={SW}/>}
        </div>
    );
}

/** Demo of using instance */
const InstanceDemo = ({SW}) => (
    <Fragment>
        <h4>Control from outside component</h4>
        <button className={'rounded-lg shadow outline-none bg-red-500 hover:bg-red-600'}
                onClick={SW.previousStep}>Previous Step
        </button>
        &nbsp;
        <button className={'rounded-lg shadow outline-none bg-green-500 hover:bg-green-600'} onClick={SW.nextStep}>Next
            Step
        </button>
        &nbsp;
        <button className={'rounded-lg shadow outline-none bg-blue-500 hover:bg-blue-60'}
                onClick={() => SW.goToNamedStep('progress')}>Go to 'progress'
        </button>
    </Fragment>
);

/**
 * Stats Component - to illustrate the possible functions
 * Could be used for nav buttons or overview
 */
const Stats = ({
                   currentStep,
                   nextStep,
                   previousStep,
                   totalSteps,
                   step,
               }) => (
    <div>
        {step > 1 &&
            <button className='rounded-lg shadow outline-none bg-red-500 hover:bg-red-600' onClick={previousStep}>Go
                Back</button>
        }
        {step < totalSteps ?
            <button className='rounded-lg shadow outline-none bg-green-500 hover:bg-green-600'
                    onClick={nextStep}>Continue</button>
            :
            <button className='rounded-lg shadow outline-none bg-blue-500 hover:bg-blue-600'
                    onClick={nextStep}>Finish</button>
        }
        <div style={{fontSize: '21px', fontWeight: '200'}}>
            <h4>Other Functions</h4>
            <div>Current Step: {currentStep}</div>
            <div>Total Steps: {totalSteps}</div>
        </div>
    </div>
);

/** Steps */

const First = props => {
    const update = (e) => {
        props.update(e.target.name, e.target.value);
    };

    return (
        <div>
            <h3 className='text-center'>Welcome! Have a look around!</h3>

            <label>First Name</label>
            <input type='text' className='form-control' name='firstname' placeholder='First Name'
                   onChange={update}/>
            <Stats step={1} {...props} />
        </div>
    );
};

const Second = props => {
    const validate = () => {
        if (confirm('Are you sure you want to go back?')) { // eslint-disable-line
            props.previousStep();
        }
    };

    return (
        <div>
            {props.form.firstname && <h3>Hey {props.form.firstname}! 👋</h3>}
            I've added validation to the previous button.
            <Stats step={2} {...props} previousStep={validate}/>
        </div>
    );
};

const Progress = (props) => {
    useEffect(() => {
        if (props.isActive) {
            const timer = setInterval(() =>
                props.nextStep(), 3000); // 1000ms = 1sec
            return () => clearInterval(timer);
        }
    });

    return (
        <div>
            <p className='text-center'>Automated Progress...</p>
            <div>
                <LinearProgress variant="indeterminate" color="secondary"/>
            </div>
        </div>
    );
};

const Last = (props) => {
    const submit = () => {
        alert('You did it! Yay!')
    };

    return (
        <div>
            <div className={'text-center'}>
                <h3>This is the last step in this example!</h3>
                <hr/>
            </div>
            <Stats step={4} {...props} nextStep={submit}/>
        </div>
    );
};
