import React, { useState } from "react";
import { connect } from "react-redux"; // Assuming you are using Redux
import Value from "./Value";
import { encode, Encoding, Tag, unpackTx, buildTx } from "@aeternity/aepp-sdk";

const GenerateSpendTransaction = ({ aeSdk }) => {
  const [spendTo, setSpendTo] = useState("");
  const [spendAmount, setSpendAmount] = useState("");
  const [spendPayload, setSpendPayload] = useState("");
  const [incrementNonce, setIncrementNonce] = useState(true);
  const [generatePromise, setGeneratePromise] = useState(null);

  const generate = async () => {
    let spendTx = await aeSdk.buildTx({
      tag: Tag.SpendTx,
      senderId: aeSdk.address,
      recipientId: spendTo,
      amount: spendAmount,
      payload: encode(
        new TextEncoder().encode(spendPayload),
        Encoding.Bytearray
      ),
    });

    if (incrementNonce) {
      const spendTxParams = unpackTx(spendTx);
      spendTxParams.nonce += 1;
      spendTx = buildTx(spendTxParams);
    }

    return spendTx;
  };

  const handleGenerateClick = () => {
    setGeneratePromise(generate());
  };

  return (
    <div>
      <h2>Generate spend transaction</h2>
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
          <div>
            <input
              value={spendAmount}
              onChange={(e) => setSpendAmount(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div>Payload</div>
          <div>
            <input
              value={spendPayload}
              onChange={(e) => setSpendPayload(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div>Increment nonce by 1</div>
          <div>
            <input
              type="checkbox"
              checked={incrementNonce}
              onChange={() => setIncrementNonce(!incrementNonce)}
            />
            (only if you want to pay for this transaction yourself)
          </div>
        </div>
        <button onClick={handleGenerateClick}>Generate</button>
        {generatePromise && (
          <div>
            <div>Spend transaction</div>
            <Value value={generatePromise} />
          </div>
        )}
      </div>
    </div>
  );
};


const mapStateToProps = (state) => ({
  aeSdk: state.aeSdk,
});

export default connect(mapStateToProps)(GenerateSpendTransaction);
