import React, { useState } from "react";
import Value from "./Value";

const FieldAction = ({
  title,
  argTitle,
  argPlaceholder,
  argDefaultValue,
  actionTitle,
  actionHandler,
  resultTitle,
}) => {
  const [argValue, setArgValue] = useState(argDefaultValue);
  const [promise, setPromise] = useState(null);

  const handleButtonClick = () => {
    setPromise(actionHandler(argValue));
  };

  return (
    <div>
      <h2>{title}</h2>
      <div className="group">
        {argTitle && (
          <div>
            <div>{argTitle}</div>
            <div>
              <input
                value={argValue}
                onChange={(e) => setArgValue(e.target.value)}
                placeholder={argPlaceholder}
              />
            </div>
          </div>
        )}
        <button onClick={handleButtonClick}>{actionTitle}</button>
        {promise && (
          <div>
            <div>{resultTitle}</div>
            <Value value={promise} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldAction;
