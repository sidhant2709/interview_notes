import { useEffect, useState } from 'react';
import './App.css';

function numberWithCommas(x) {
  if (x) return `₹ ${x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

const tenureTypes = [12, 24, 36, 48, 60];

function App() {
  const [cost, setCost] = useState(100);
  const [interest, setIntrest] = useState(10);
  const [processingFee, setProcessingFee] = useState(1);
  const [downPayment, setDownPayment] = useState(0);
  const [tenure, setTenure] = useState(12);
  const [emi, setEmi] = useState(0);

  const calculateEmi = downPayment => {
    // EMI Amount = [P * R * (1+R)^N]/[(1+R)^N-1]

    if (!cost || cost < 0) {
      return;
    }

    const loanAmount = cost - downPayment;
    const rateOfInterest = interest / 100;
    const numOfYears = tenure / 12;

    const EMI =
      (loanAmount * rateOfInterest * (1 + rateOfInterest) ** numOfYears) / ((1 + rateOfInterest) ** numOfYears - 1);

    return Number(EMI / 12).toFixed(0);
  };

  const calculateDownPayment = downPayment => {
    if (!cost) {
      return;
    }

    const downPaymentPercent = 100 - (emi / calculateEmi(0)) * 100;

    return Number((downPaymentPercent / 100) * cost).toFixed(0);
  };

  const updateEmi = e => {
    if (!cost) {
      return;
    }

    const dp = +e.target.value;
    setDownPayment(dp.toFixed(0));

    const emi = calculateEmi(dp);
    setEmi(emi);
  };
  const updateDownPayment = e => {
    if (!cost) {
      return;
    }
    const emi = +e.target.value;
    setEmi(emi.toFixed(0));

    const dp = calculateDownPayment(emi);
    setDownPayment(dp);
  };

  console.log(downPayment);

  useEffect(() => {
    if (!(cost > 0)) {
      setDownPayment(0);
      setEmi(0);
    }
    const emi = calculateEmi(downPayment);
    setEmi(emi);
  }, [tenure, cost]);

  return (
    <div className="App">
      <span className="title" style={{ fontSize: '3rem', marginTop: '1rem', textAlign: 'center' }}>
        EMI Calculator
      </span>

      <span className="title" style={{}}>
        Total Cost of Asset
      </span>
      <input type="number" value={cost} placeholder="Total Cost of Asset" onChange={e => setCost(+e.target.value)} />

      <span className="title" style={{}}>
        Intrest Rate (in %)
      </span>
      <input
        type="number"
        value={interest}
        placeholder="Intrest Rate (in %)"
        onChange={e => setIntrest(+e.target.value)}
      />

      <span className="title" style={{}}>
        Processing Fee (in %)
      </span>
      <input
        type="number"
        value={processingFee}
        placeholder="Processing Fee (in %)"
        onChange={e => setProcessingFee(+e.target.value)}
      />

      <span className="title" style={{}}>
        Down Payment
      </span>
      {downPayment > 0 && (
        <>
          <span className="title" style={{ textDecoration: 'underline' }}>
            Total Down Payment -
            {numberWithCommas((Number(downPayment) + (cost - downPayment) * (processingFee / 100)).toFixed(0))}
          </span>
        </>
      )}
      <div>
        <input type="range" value={downPayment} min={0} max={cost} onChange={updateEmi} className="slider" id="dp" />
        <div className="labels">
          <label htmlFor="dp">0%</label>
          <b>{numberWithCommas(downPayment)}</b>
          <label htmlFor="dp">100%</label>
        </div>
      </div>

      <span className="title" style={{}}>
        EMI Per Month
      </span>
      {emi && (
        <>
          <span className="title" style={{ textDecoration: 'underline' }}>
            Total EMI - {numberWithCommas((emi * tenure).toFixed(0))}
          </span>
        </>
      )}
      <div>
        <input
          type="range"
          value={emi}
          min={calculateEmi(cost)}
          max={calculateEmi(0)}
          onChange={updateDownPayment}
          className="slider"
        />
        <div className="labels">
          <label htmlFor="">{calculateEmi(cost)}</label>
          <b>{numberWithCommas(emi)}</b>
          <label htmlFor="">{numberWithCommas(calculateEmi(0))}</label>
        </div>
      </div>

      <span className="title" style={{}}>
        Tenure
      </span>
      <div className="tenureContainer">
        {tenureTypes.map((t, i) => {
          return (
            <button key={i} onClick={() => setTenure(t)} className={`tenure ${t === tenure ? 'selected' : ''}`}>
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App;
