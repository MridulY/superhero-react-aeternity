import React, { useState, useEffect } from 'react';

const DisplayValue = ({ value }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const updateValue = async () => {
      if (!value || !value.then) {
        setText(valueToString(value));
        return;
      }

      setText('Waiting for resolving');
      setError(false);

      try {
        const result = await value;
        setText(valueToString(result));
      } catch (error) {
        console.warn(error);
        setError(true);
        setText(error);
      }
    };

    updateValue();
  }, [value]);

  const valueToString = (value) => {
    if (typeof value !== 'object') return value;
    return JSON.stringify(
      value,
      (k, v) => (typeof v === 'bigint' ? `${v} (as BigInt)` : v),
      2,
    );
  };

  return (
    <div className={error ? 'error' : ''}>
      {text}
    </div>
  );
};

export default DisplayValue;
