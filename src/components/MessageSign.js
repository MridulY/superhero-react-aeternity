import React from "react";
import { connect } from "react-redux"; 
import FieldAction from "./FieldAction";

const SignMessage = ({ aeSdk }) => {
  const messageSign = async (messageToSign) => {
    return aeSdk.signMessage(messageToSign);
  };

  return (
    <FieldAction
      title="Sign a message"
      argTitle="Message to sign"
      argPlaceholder="I want to <action name> at <time> on <network name>"
      actionTitle="Sign message"
      actionHandler={messageSign}
      resultTitle="Message sign result"
    />
  );
};


const mapStateToProps = (state) => ({
  aeSdk: state.aeSdk,
});

export default connect(mapStateToProps)(SignMessage);
