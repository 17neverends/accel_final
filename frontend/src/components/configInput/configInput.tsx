import React, { useState } from 'react';
import { InputProps } from '../../interfaces/inputProps';
import styles from './configInput.module.css';


const InputField: React.FC<InputProps> = ({ value, onChange, label, placeholder, readOnly }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={styles.customInput}>
      <label style={{ visibility: (value || (isFocused && value !== '')) ? 'visible' : 'hidden' }}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
};

export default InputField;
