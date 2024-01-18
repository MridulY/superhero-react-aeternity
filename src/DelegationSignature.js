import React, { useState } from 'react';
import { connect } from 'react-redux'; // Assuming you are using Redux
import Value from './components/Value';

const SignDelegation = ({ aeSdk }) => {
  const [type, setType] = useState('general');
  const [contractAddress, setContractAddress] = useState('ct_6y3N9KqQb74QsvR9NrESyhWeLNiA9aJgJ7ua8CvsTuGot6uzh');
  const [name, setName] = useState('test.chain');
  const [oracleQueryId, setOracleQueryId] = useState('oq_6y3N9KqQb74QsvR9NrESyhWeLNiA9aJgJ7ua8CvsTuGot6uzh');
  const [signPromise, setSignPromise] = useState(null);

  const sign = () => {
    switch (type) {
      case 'general':
        return aeSdk.signDelegationToContract(contractAddress);
      case 'name':
        return aeSdk.signNameDelegationToContract(contractAddress, name);
      case 'all-names':
        return aeSdk.signAllNamesDelegationToContract(contractAddress);
      case 'oracle-query':
        return aeSdk.signOracleQueryDelegationToContract(contractAddress, oracleQueryId);
      default:
        throw new Error(`Unknown delegation signature type: ${type}`);
    }
  };

  return (
    <div>
      <h2>Sign delegation to contract</h2>
      <div className="group">
        <div>
          <div>Contract address</div>
          <div>
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="general"
              checked={type === 'general'}
              onChange={() => setType('general')}
            />
            AENS preclaim and oracle
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="name"
              checked={type === 'name'}
              onChange={() => setType('name')}
            />
            AENS name
          </label>
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="all-names"
              checked={type === 'all-names'}
              onChange={() => setType('all-names')}
            />
            All AENS names
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="oracle-query"
              checked={type === 'oracle-query'}
              onChange={() => setType('oracle-query')}
            />
            Oracle query
          </label>
          <div>
            <input
              type="text"
              value={oracleQueryId}
              onChange={(e) => setOracleQueryId(e.target.value)}
            />
          </div>
        </div>
        <button onClick={() => setSignPromise(sign())}>Sign</button>
        {signPromise && (
          <div>
            <div>Signature</div>
            <Value value={signPromise} />
          </div>
        )}
      </div>
    </div>
  );
};

// Assuming you have a Redux store and aeSdk is available in the state
const mapStateToProps = (state) => ({
  aeSdk: state.aeSdk,
});

export default connect(mapStateToProps)(SignDelegation);
