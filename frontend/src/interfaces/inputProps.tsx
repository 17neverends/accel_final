export interface InputProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder: string;
    readOnly?: boolean;
  }