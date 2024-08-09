import "./App.css";
import Container from "./components/Container";

function App() {
  return (
    <Container>
      <h1>PeerJS Example</h1>
      <div className="card">
        <p>
          Go to{" "}
          <code>
            <a href="/ping" className="text-blue-500">
              /ping
            </a>
          </code>{" "}
          to set receiverPeerId and create initial peer.
        </p>
        <p>
          Go to{" "}
          <code>
            <a href="/pong" className="text-blue-500">
              /pong
            </a>
          </code>
          , ensure receiverPeerId matches and await connections.
        </p>
      </div>
    </Container>
  );
}

export default App;
