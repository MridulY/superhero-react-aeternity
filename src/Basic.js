import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'; // Assuming you are using Redux
import Value from './components/Value';
import SpendCoins from './components/SpendCoins';
import MessageSign from './components/MessageSign';

const GeneralInformation = ({ aeSdk, address, networkId }) => {
  const [balancePromise, setBalancePromise] = useState(null);
  const [heightPromise, setHeightPromise] = useState(null);
  const [nodeInfoPromise, setNodeInfoPromise] = useState(null);
  const [compilerVersionPromise, setCompilerVersionPromise] = useState(null);

  useEffect(() => {
    const updatePromises = async () => {
      try {
        setCompilerVersionPromise(aeSdk.compilerApi.version());
        setBalancePromise(address ? aeSdk.getBalance(address) : Promise.reject(new Error('Address not available')));
        setHeightPromise(aeSdk.getHeight());
        setNodeInfoPromise(aeSdk.getNodeInfo());
      } catch (error) {
        console.error(error);
      }
    };

    updatePromises();
  }, [aeSdk, address, networkId]);

  return (
    <div>
      <h2>General information</h2>
      <div className="group">
        <div>
          <div>Address</div>
          <div>{address}</div>
        </div>
        <div>
          <div>Balance</div>
          <Value value={balancePromise} />
        </div>
        <div>
          <div>Height</div>
          <Value value={heightPromise} />
        </div>
        <div>
          <div>Node info</div>
          <Value value={nodeInfoPromise} />
        </div>
        <div>
          <div>Compiler version</div>
          <Value value={compilerVersionPromise} />
        </div>
      </div>

      <SpendCoins />

      <MessageSign />
    </div>
  );
};

// Assuming you have a Redux store and aeSdk, address, and networkId are stored in the state
const mapStateToProps = (state) => ({
  aeSdk: state.aeSdk,
  address: state.address,
  networkId: state.networkId,
});

export default connect(mapStateToProps)(GeneralInformation);
