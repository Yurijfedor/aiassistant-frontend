import UserCard from "./UserCard";
import AiAssistant from "./aiAssistant";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <h1>Intern Dashboard</h1>

        <UserCard name="Yurii" method={1} />
        <UserCard name="AI Bot" method={0} />
        <AiAssistant />
      </div>
    </>
  );
}

export default App;
