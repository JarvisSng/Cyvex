import React from 'react';

const knownRules = [
  'AES', 'RSA', 'SHA', 'SHA-1', 'MD5', 'HMAC', 'DES', 'Hardcoded Key', 'RSA (Weak Key)'
];

const RulesEditor = ({ rules = [], toggleRule, removeAllRules, addAllRules }) => {
  return (
    <div style={{ margin: '20px 0' }}>
      <h2>Define Rules / Patterns</h2>
      <div>
        {knownRules.map((rule, index) => (
          <label key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <input
              type="checkbox"
              checked={rules.includes(rule)}
              onChange={() => toggleRule(rule)}
            />
            {rule}
          </label>
        ))}
      </div>

      {/* Buttons Container */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        {/* Add All Rules Button */}
        <button
          onClick={addAllRules}
          style={{
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          Add All
        </button>

        {/* Remove All Rules Button (Only visible if rules exist) */}
        {rules.length > 0 && (
          <button
            onClick={removeAllRules}
            style={{
              padding: '10px',
              backgroundColor: '#b22222',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Remove All
          </button>
        )}
      </div>
    </div>
  );
};

export default RulesEditor;
