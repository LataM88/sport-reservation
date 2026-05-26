import { forwardRef } from 'react';
import styles from './FormInput.module.css';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, ...inputProps }, ref) => {
    const isCheckbox = inputProps.type === 'checkbox';

    if (isCheckbox) {
      return (
        <div className={styles.checkboxBox}>
          <input ref={ref} {...inputProps} />
          <label>{label}</label>
        </div>
      );
    }

    return (
      <div className={styles.labelBox}>
        <label>{label}</label>
        <input ref={ref} {...inputProps} />
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';

export default FormInput;
