import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import { FormInput } from './FormInput';

describe('FormInput', () => {
  it('renders label and input element', () => {
    // Arrange & Act
    render(<FormInput label="Email" />);

    // Assert
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    // Arrange & Act
    render(<FormInput label="Email" error="To pole jest wymagane" />);

    // Assert
    expect(screen.getByText('To pole jest wymagane')).toBeInTheDocument();
  });

  it('does not display error when error prop is absent', () => {
    // Arrange & Act
    render(<FormInput label="Email" />);

    // Assert
    expect(screen.queryByText('To pole jest wymagane')).not.toBeInTheDocument();
  });

  it('renders checkbox variant with correct layout', () => {
    // Arrange & Act
    render(<FormInput label="Zapamiętaj mnie" type="checkbox" />);

    // Assert
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(screen.getByText('Zapamiętaj mnie')).toBeInTheDocument();
  });

  it('forwards ref to the input element', () => {
    // Arrange
    const ref = React.createRef<HTMLInputElement>();

    // Act
    render(<FormInput label="Imię" ref={ref} />);

    // Assert
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('passes additional input attributes', () => {
    // Arrange & Act
    render(<FormInput label="Email" placeholder="jan@example.com" required />);

    // Assert
    const input = screen.getByPlaceholderText('jan@example.com');
    expect(input).toBeRequired();
  });
});
