import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { hashTypedData, verify, decode } from '@aeternity/aepp-sdk';
import { TypeResolver, ContractByteArrayEncoder } from '@aeternity/aepp-calldata';
import Value from './components/Value';
import FieldAction from './components/FieldAction';

const YourComponent = ({ aeSdk }) => {
  const [domain] = useState({
    name: 'Simple æpp',
    version: 2,
    networkId: 'ae_uat',
    contractAddress: null,
  });
  const [aci] = useState(
    Value.methods.valueToString({
      record: [
        { name: 'operation', type: 'string' },
        { name: 'parameter', type: 'int' },
      ],
    })
  );
  const [data] = useState(
    Value.methods.valueToString({
      operation: 'test',
      parameter: 42,
    })
  );
  const [verifySignature] = useState(null);
  const [verifyAddress] = useState(null);
  const [verifyPromise, setVerifyPromise] = useState(null);


  useEffect(() => {
    const dataParsed = JSON.parse(data);
    const aciParsed = JSON.parse(aci);
    const dataType = new TypeResolver().resolveType(aciParsed);
    const dataEncoded = new ContractByteArrayEncoder().encodeWithType(dataParsed, dataType);
    const hash = hashTypedData(dataEncoded, aciParsed, domain);

    setVerifyPromise(() =>
      verify(hash, decode(verifySignature), verifyAddress).then((result) => result)
    );
  }, [data, aci, domain, verifySignature, verifyAddress]);

  const signTypedData = () => {
    const dataParsed = JSON.parse(data);
    const aciParsed = JSON.parse(aci);
    const dataType = new TypeResolver().resolveType(aciParsed);
    const dataEncoded = new ContractByteArrayEncoder().encodeWithType(dataParsed, dataType);

    return aeSdk.signTypedData(dataEncoded, aciParsed, domain);
  };

  return (
    <>
      <h2>Domain</h2>
      <div className="group">
        {/* Your domain input fields */}
      </div>

      <h2>Data</h2>
      <div className="group">
        {/* Your data input fields */}
        <Value value={verifyPromise} />
        <Value value={verifyPromise} />
      </div>

      <FieldAction
        title="Sign"
        action-title="Sign"
        actionHandler={signTypedData}
        result-title="Signature"
      />

      <h2>Verify</h2>
      <div className="group">
        {/* Your verify input fields and button */}
        {verifyPromise && (
          <div>
            <div>Is signature correct</div>
            <Value value={verifyPromise} />
          </div>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  aeSdk: state.aeSdk,
});

export default connect(mapStateToProps)(YourComponent);
