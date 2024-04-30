import MainContents from "./components/MainContents";
import Container from "@mui/material/Container";
import "./App.css";

function App() {
  return (
    <>
      <div className="app-container">
        <Container maxWidth="xl">
          <MainContents />
        </Container>
      </div>
    </>
  );
}

export default App;
