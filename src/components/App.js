import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";

import Progress from "./Progress";
import { useQuiz } from "../context/QuizContext";
import Question from "./Question";
import Footer from "./Footer";
import Timer from "./Timer";
import NextButton from "./NextButton";
import FinishScreen from "./FinishScreen";

function App() {
  const { status } = useQuiz();
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progress />
            <Question />
            <Footer>
              <Timer />
              <NextButton />
            </Footer>
          </>
        )}
      </Main>
      {status === "finished" && <FinishScreen />}
    </div>
  );
}

export default App;
