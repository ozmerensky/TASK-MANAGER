import React from 'react';
import styles from './Input.module.css';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ value, onChange, placeholder }) => {
  return (
    <input
      className={styles.input}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default Input;
