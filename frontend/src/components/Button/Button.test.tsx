import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children text', () => {
    // Arrange & Act
    render(<Button>Zarezerwuj</Button>);

    // Assert
    expect(screen.getByRole('button')).toHaveTextContent('Zarezerwuj');
  });

  it('calls onClick handler when clicked', async () => {
    // Arrange
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Kliknij</Button>);

    // Act
    await userEvent.click(screen.getByRole('button'));

    // Assert
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is set', () => {
    // Arrange & Act
    render(<Button disabled>Wyłączony</Button>);

    // Assert
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onClick when disabled', async () => {
    // Arrange
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Wyłączony
      </Button>,
    );

    // Act
    await userEvent.click(screen.getByRole('button'));

    // Assert
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies fullWidth class when prop is true', () => {
    // Arrange & Act
    render(<Button fullWidth>Szeroki</Button>);

    // Assert
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('fullWidth');
  });

  it('applies variant class', () => {
    // Arrange & Act
    render(<Button variant="outline">Outline</Button>);

    // Assert
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('outline');
  });
});
