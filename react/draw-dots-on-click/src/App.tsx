import { useState } from 'react';

import './App.css';

interface Dot {
  x: number;
  y: number;
}

function App() {
  const [dots, setDots] = useState<Dot[]>([]);

  const [cacheDots, setCacheDots] = useState<Dot[]>([]);

  const draw = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setDots([...dots, { x: clientX, y: clientY }]);
  };

  const undo = () => {
    if (dots.length > 0) {
      const newDots = [...dots];
      const lastDot = newDots.pop() as Dot;
      Promise.all([setCacheDots([...cacheDots, lastDot]), setDots(newDots)]);
    }
  };

  const redo = () => {
    if (cacheDots.length > 0) {
      const newCacheDots = [...cacheDots];
      const lastCacheDots = newCacheDots.pop() as Dot;
      Promise.all([setCacheDots(newCacheDots), setDots([...dots, lastCacheDots])]);
    }
  };

  return (
    <div className="App">
      <div className="button-wrapper">
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>
      <div className="draw-area" onClick={draw}>
        {dots.map((dot: Dot, i: number) => {
          const { x, y } = dot;
          return <div key={`dot-${i}`} className="dot" style={{ left: x, top: y }} />;
        })}
      </div>
    </div>
  );
}

export default App;
