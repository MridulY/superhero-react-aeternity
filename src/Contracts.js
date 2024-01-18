import React, { useState, useRef } from 'react';
import { connect } from 'react-redux'; // Assuming you are using Redux
import Value from './components/Value';
import FieldAction from './components/FieldAction';

const ContractInstance = ({ aeSdk }) => {
  const contractSourceCode = `
    contract Multiplier =
      record state = { factor: int }

      entrypoint init(f : int) = { factor = f }

      stateful entrypoint setFactor(f : int) =
        put(state{ factor = f })

      entrypoint multiplyByFactor(x : int) =
        x * state.factor
  `.trim();

  const [createPromise, setCreatePromise] = useState(null);
  const [contract, setContract] = useState(null);
  const [deployPromise, setDeployPromise] = useState(null);

  const contractSourceCodeRef = useRef(contractSourceCode);

  const create = async () => {
    const initializedContract = await aeSdk.initializeContract({ sourceCode: contractSourceCodeRef.current });
    setContract(initializedContract);
    setCreatePromise('Ready');
  };

  const compile = async () => {
    return contract.$compile();
  };

  const deploy = async (arg) => {
    const newDeployPromise = contract.$deploy([arg]);
    setDeployPromise(newDeployPromise);
    return newDeployPromise;
  };

  const callOnChain = async (arg) => {
    return contract.setFactor(arg);
  };

  const callStatic = async (arg) => {
    return contract.multiplyByFactor(arg);
  };

  return ( 
    <div>
      <h2>Contract Instance</h2>
      <div className="group">
        <div>
          <div>Contract Source Code</div>
          <div>
            <textarea
              value={contractSourceCodeRef.current}
              onChange={(e) => (contractSourceCodeRef.current = e.target.value)}
              placeholder="Contact source code"
            />
          </div>
        </div>
        <button onClick={() => setCreatePromise(create())}>Create</button>
        {createPromise && (
          <div>
            <div>Contract Instance</div>
            <Value value={createPromise} />
          </div>
        )}
      </div>

      {contract && (
        <>
          <FieldAction
            title="Compile Contract"
            action-title="Compile"
            actionHandler={compile}
            result-title="Bytecode"
          />

          <FieldAction
            title="Deploy Contract"
            arg-title="Deploy argument"
            arg-placeholder="Deploy argument"
            arg-default-value="5"
            action-title="Deploy"
            actionHandler={deploy}
            result-title="Deployed Contract"
          />
        </>
      )}

      {deployPromise && (
        <>
          <FieldAction
            title="Call Contract on chain"
            arg-title="Call argument"
            arg-placeholder="Call argument"
            arg-default-value="7"
            action-title="Call"
            actionHandler={callOnChain}
            result-title="Call Result"
          />

          <FieldAction
            title="Call Contract using dry-run (static)"
            arg-title="Call argument"
            arg-placeholder="Call argument"
            arg-default-value="8"
            action-title="Call"
            actionHandler={callStatic}
            result-title="Call Result"
          />
        </>
      )}
    </div>
  );
};

// Assuming you have a Redux store and aeSdk is available in the state
const mapStateToProps = (state) => ({
  aeSdk: state.aeSdk,
});

export default connect(mapStateToProps)(ContractInstance);
