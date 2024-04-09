import { useEffect, useReducer } from "react";
// import DateCounter from "./DateCounter";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartPage from "./StartPage";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  timeRemaining: 0
}
function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: "ready" }
    case 'dataFailed':
      return { ...state, status: "error" }
    case 'start':
      return { ...state, status: 'active', timeRemaining: state.questions.length * 30 }
    case 'newAnswer':
      const question = state.questions.at(state.index)
      return {
        ...state,
        answer: action.payload,
        points: question.correctOption === action.payload ? state.points + question.points : state.points
      }
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null }
    case 'finish':
      return { ...state, status: 'finished', highScore: state.points }
    case 'tik-tik':
      return { ...state, timeRemaining: state.timeRemaining - 1, status: state.timeRemaining === 0 ? "finished" : state.status }
    case 'restart':
      return {
        ...initialState,
        status: 'ready',
        questions: state.questions
      }
    default:
      throw new Error(`Invalid action`);

  }
}

function App() {
  const [{ questions, status, index, answer, points, highScore, timeRemaining }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, [])

  return (
    <div className="app">
      <Header />
      <Main>

        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartPage numQuestions={numQuestions} dispatch={dispatch} />}
        {status === "active" &&
          <>
            <Progress numQuestions={numQuestions} index={index} points={points} maxPoints={maxPoints} answer={answer} />
            <Question question={questions[index]} answer={answer} dispatch={dispatch} />
            <Footer>
              <Timer timeRemaining={timeRemaining} dispatch={dispatch} />
              <NextButton answer={answer} dispatch={dispatch} numQuestions={numQuestions} index={index} />
            </Footer>
          </>
        }
        {status === 'finished' && <FinishScreen maxPoints={maxPoints} points={points} highScore={highScore} dispatch={dispatch} />}
      </Main>
    </div>
    // <DateCounter />
  );
}

export default App;
