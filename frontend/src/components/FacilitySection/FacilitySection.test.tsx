import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import FacilitySection from './FacilitySection';
import type { Facility } from '../../types/types';

const mockFacilities: Facility[] = [
  {
    id: 'fac-1',
    name: 'Kort Tenisowy Wimbledon',
    category: 'tenis',
    base_price: 80,
    is_active: true,
  },
  {
    id: 'fac-2',
    name: 'Boisko Piłkarskie Orlik',
    category: 'piłka nożna',
    base_price: 120,
    is_active: true,
  },
  {
    id: 'fac-3',
    name: 'Basen Olimpijski',
    category: 'pływanie',
    base_price: 45,
    is_active: true,
  },
  {
    id: 'fac-4',
    name: 'Hala do Koszykówki',
    category: 'koszykówka',
    base_price: 150,
    is_active: true,
  },
];

describe('FacilitySection', () => {
  it('renders section title and total count', () => {
    // Arrange & Act
    render(
      <FacilitySection
        title="Polecane obiekty"
        facilities={mockFacilities}
        onFacilityClick={vi.fn()}
      />,
    );

    // Assert
    expect(screen.getByText('Polecane obiekty (4)')).toBeInTheDocument();
  });

  it('renders initial number of facilities and shows "Zobacz wszystkie" button', () => {
    // Arrange & Act
    render(
      <FacilitySection
        title="Wszystkie obiekty"
        facilities={mockFacilities}
        initialCount={3}
        onFacilityClick={vi.fn()}
      />,
    );

    // Assert
    expect(screen.getByText('Zobacz wszystkie')).toBeInTheDocument();
  });

  it('toggles all facilities when "Zobacz wszystkie" is clicked', async () => {
    // Arrange
    render(
      <FacilitySection
        title="Wszystkie obiekty"
        facilities={mockFacilities}
        initialCount={3}
        onFacilityClick={vi.fn()}
      />,
    );

    const toggleButton = screen.getByText('Zobacz wszystkie');

    // Act
    await userEvent.click(toggleButton);

    // Assert
    expect(screen.getByText('Ukryj')).toBeInTheDocument();
  });

  it('calls onFacilityClick with facility id when card is clicked', async () => {
    // Arrange
    const handleFacilityClick = vi.fn();
    render(
      <FacilitySection
        title="Obiekty"
        facilities={mockFacilities}
        onFacilityClick={handleFacilityClick}
      />,
    );

    // Act
    const cardTitle = screen.getAllByText('Kort Tenisowy Wimbledon')[0];
    await userEvent.click(cardTitle);

    // Assert
    expect(handleFacilityClick).toHaveBeenCalledWith('fac-1');
  });

  it('handles empty facilities list gracefully', () => {
    // Arrange & Act
    render(
      <FacilitySection
        title="Pusta lista"
        facilities={[]}
        onFacilityClick={vi.fn()}
      />,
    );

    // Assert
    expect(screen.getByText('Pusta lista (0)')).toBeInTheDocument();
    expect(screen.queryByText('Zobacz wszystkie')).not.toBeInTheDocument();
  });
});
