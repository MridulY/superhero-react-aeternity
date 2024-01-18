import React, { useState } from "react";
import Connect from "./Connect";
import Basic from "./Basic";
import Contracts from "./Contracts";
import PayForTx from "./PayForTx";
import TypedData from "./TypedData";
import DelegationSignature from "./DelegationSignature";
import './styles.css'

const SimpleAepp = () => {
  const [view, setView] = useState("");

  const changeView = (newView) => {
    setView(newView);
  };

  const getViewComponent = () => {
    switch (view) {
      case "Basic":
        return <Basic />;
      case "Contracts":
        return <Contracts />;
      case "PayForTx":
        return <PayForTx />;
      case "TypedData":
        return <TypedData />;
      case "DelegationSignature":
        return <DelegationSignature />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2>Simple æpp</h2>

      <Connect />

      <div className="nav">
        <button
          className={view === "Basic" ? "active" : ""}
          onClick={() => changeView("Basic")}
        >
          Basic functionality
        </button>
        <button
          className={view === "Contracts" ? "active" : ""}
          onClick={() => changeView("Contracts")}
        >
          Smart contracts
        </button>
        <button
          className={view === "PayForTx" ? "active" : ""}
          onClick={() => changeView("PayForTx")}
        >
          Pay for transaction
        </button>
        <button
          className={view === "TypedData" ? "active" : ""}
          onClick={() => changeView("TypedData")}
        >
          Typed data
        </button>
        <button
          className={view === "DelegationSignature" ? "active" : ""}
          onClick={() => changeView("DelegationSignature")}
        >
          Delegation signature
        </button>
      </div>

      {getViewComponent()}
    </div>
  );
};

export default SimpleAepp;
