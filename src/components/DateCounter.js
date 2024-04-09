import React, { useReducer } from 'react'

const initialState = { count: 0, step: 1 };
function reducer(state, action) {

    switch (action.type) {
        case 'inc':
            return { ...state, count: state.count + state.step }
        case 'dec':
            return { ...state, count: state.count - state.step }
        case 'setCount':
            return { ...state, count: action.payload }
        case 'setStep':
            return { ...state, step: action.payload }
        case "reset":
            return initialState;
        default:
            throw new Error("Unknown action")
    }
}

const DateCounter = () => {
    // const [step, setStep] = useState(1);
    // const [count, setCount] = useState(0);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { step, count } = state;

    const date = new Date("june 21 2027");
    date.setDate(date.getDate() + count);


    function defineStep(e) {
        // setStep(Number(e.target.value));
        dispatch({ type: "setStep", payload: Number(e.target.value) });
    }

    function defineCount(e) {
        // setCount(Number(e.target.value));
        dispatch({ type: 'setCount', payload: Number(e.target.value) });
    }
    function dec() {
        dispatch({ type: 'dec' })
        // setCount((count) => count - step);
    }
    function inc() {
        dispatch({ type: 'inc' })
        // setCount((count) => count + step);
    }

    function reset() {
        dispatch({ type: 'reset' })
        // setCount(0);
        // setStep(1);
    }
    return (
        <div className="counter">
            <div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={step}
                    onChange={defineStep}
                />
                <span>{step}</span>
            </div>

            <div>
                <button
                    onClick={dec}
                >-</button>
                <input value={count}
                    onChange={defineCount}
                />
                <button onClick={inc}>+</button>
            </div>

            <p>{date.toDateString()}</p>

            <div>
                <button onClick={reset}>Reset</button>
            </div>
        </div>
    );
}

export default DateCounter
