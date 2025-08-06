'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';
import {
  InputContainer,
  InputField as StyledInputField,
  Label,
  ErrorMessage,
  HelperText,
} from './InputField.styled';

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <InputContainer className={className}>
        {label && (
          <Label htmlFor={props.id}>
            {label}
            {required && <span style={{ color: 'red' }}> *</span>}
          </Label>
        )}
        <StyledInputField
          ref={ref}
          $hasError={hasError}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <ErrorMessage id={`${props.id}-error`} role="alert">
            {error}
          </ErrorMessage>
        )}
        {helperText && !error && (
          <HelperText id={`${props.id}-helper`}>
            {helperText}
          </HelperText>
        )}
      </InputContainer>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
