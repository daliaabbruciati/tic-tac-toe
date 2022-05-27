import {Game} from "./components/game";

function App() {
    console.log('render in App.js')
    return (
        <div className="App">
            <h2>Tic tac toe</h2>
            <Game/>
        </div>
    );
}

export default App;
