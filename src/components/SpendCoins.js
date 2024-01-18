import React, { useState } from 'react';
import { connect } from 'react-redux'; // Assuming you are using Redux
import Value from './Value';
import { encode, Encoding } from '@aeternity/aepp-sdk';

const SpendCoins = ({ aeSdk }) => {
  const [spendTo, setSpendTo] = useState('');
  const [spendAmount, setSpendAmount] = useState('');
  const [spendPayload, setSpendPayload] = useState('');
  const [spendPromise, setSpendPromise] = useState(null);

  const spend = () => {
    return aeSdk.spend(spendAmount, spendTo, {
      payload: encode(new TextEncoder().encode(spendPayload), Encoding.Bytearray),
    });
  };

  const handleSpendClick = () => {
    setSpendPromise(spend());
  };

  return (
    <div>
      <h2>Spend coins</h2>
      <div className="group">
        <div>
          <div>Recipient address</div>
          <div>
            <input
              value={spendTo}
              onChange={(e) => setSpendTo(e.target.value)}
              placeholder="ak_..."
            />
          </div>
        </div>
        <div>
          <div>Coins amount</div>
          <div><input value={spendAmount} onChange={(e) => setSpendAmount(e.target.value)} /></div>
        </div>
        <div>
          <div>Payload</div>
          <div><input value={spendPayload} onChange={(e) => setSpendPayload(e.target.value)} /></div>
        </div>
        <button onClick={handleSpendClick}>Spend</button>
        {spendPromise && (
          <div>
            <div>Spend result</div>
            <Value value={spendPromise} />
          </div>
        )}
      </div>
    </div>
  );
};

// Assuming you have a Redux store and aeSdk is stored in the state
const mapStateToProps = (state) => ({
  aeSdk: state.aeSdk,
});

export default connect(mapStateToProps)(SpendCoins);
