import React from 'react';
import { connect } from 'react-redux';
import FieldAction from './components/FieldAction';
//import SpendCoins from './components/SpendCoins';
//import MessageSign from './components/MessageSign';
import GenerateSpendTx from './components/GenerateSpendTx';

const MainComponent = ({ aeSdk }) => {
  const signInnerTx = async (txToPayFor) => {
    return aeSdk.signTransaction(txToPayFor, { innerTx: true });
  };

  const payForTx = async (innerTx) => {
    return aeSdk.payForTransaction(innerTx);
  };

  return (
    <>
      <GenerateSpendTx />

      <FieldAction
        title="Sign inner transaction"
        arg-title="Transaction"
        arg-placeholder="tx_..."
        action-title="Sign"
        actionHandler={signInnerTx}
        result-title="Signed inner transaction"
      />

      <FieldAction
        title="Pay for transaction"
        arg-title="Signed inner transaction"
        arg-placeholder="tx_..."
        action-title="Pay for transaction"
        actionHandler={payForTx}
        result-title="Result"
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  aeSdk: state.aeSdk,
});

export default connect(mapStateToProps)(MainComponent);
