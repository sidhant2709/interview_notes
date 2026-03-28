import { useState } from 'react';
import './App.css';
import { Select, SelectOption } from './Select';

const options = [
    { label: 'First', value: 1 },
    { label: 'Second', value: 2 },
    { label: 'Third', value: 3 },
    { label: 'Fourth', value: 4 },
    { label: 'Fifth', value: 5 },
];

function App() {
    const [value1, setValue1] = useState<SelectOption[]>([]);

    return (
        <div className="App">
            <h2>React Custom Dropdown Multi Select & All select component</h2>
            <Select
                options={options}
                value={value1}
                onChange={o => setValue1(o)}
            />
        </div>
    );
}

export default App;
