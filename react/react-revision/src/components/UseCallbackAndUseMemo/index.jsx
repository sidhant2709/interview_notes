import { useState, useCallback } from 'react';
import GreetingsBox from './GreetingsBox';

function UseCallBackAndUseMemo() {
  const [name, setName] = useState('');
  const [counter, setCounter] = useState(0);

  const getGreeting = useCallback(() => {
    return `Hello ${name}!`;
  }, [name]);

  //   const getGreeting = () => {
  //     return `Hello ${name}!`;
  //   };

  return (
    <div className="App">
      <input placeholder="Enter your name" type="text" value={name} onChange={e => setName(e.target.value)} />
      <GreetingsBox getGreeting={getGreeting} />

      {counter}
      <button onClick={() => setCounter(counter + 1)}>+ by 1</button>
    </div>
  );
}

export default UseCallBackAndUseMemo;
