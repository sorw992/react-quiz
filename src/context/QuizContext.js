import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const SECS_PER_QUESTION = 30;

let initialState = {
  questions: [],
  // app statuses: 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  // current question (for showing in ui)
  index: 0,
  // there will be no answer initially
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      // state.questions.length * SECS_PER_QUESTION : user  have SECS_PER_QUESTION secods for every question to answer
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const currentQuestion = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currentQuestion.correctOption
            ? state.points + currentQuestion.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restartQuiz":
      return {
        ...initialState,
        // we don't want to refetch it so we use questions that loaded before.
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
      };
    // this is the entire heart of the timer feature.
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        // state.status: otherwise status stays the same
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action Unknown");
  }
}

function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  //derived state
  const numQuestions = questions.length;
  //second argument is initial value
  const maxPossiblePoints = questions.reduce(
    // sum all the possible questions points
    (previousValue, currentValue) => previousValue + currentValue.points,
    0
  );

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))

      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

// custom hook
function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("Quiz Context was used outside of the QuizProvider.");
  return context;
}

export { QuizProvider, useQuiz };
