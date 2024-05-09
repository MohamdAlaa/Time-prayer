import MainContent from "./components/MainContent";
import Container from "@mui/material/Container";
import "./App.css";

function App() {
  return (
    <>
      <div className="app-container">
        <Container maxWidth="xl">
          <MainContent />
        </Container>
      </div>
    </>
  );
}

export default App;
