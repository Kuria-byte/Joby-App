import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SwipeDeck from './SwipeDeck';
import { jobAPI } from '../../services/jobAPI';

// Mock the jobAPI
jest.mock('../../services/jobAPI', () => ({
  jobAPI: {
    recordJobInterest: jest.fn(),
    dismissJob: jest.fn(),
  },
}));

const mockJobs = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Tech Co',
    location: 'New York',
    description: 'Frontend role',
    salary: '$100k-$130k',
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'Tech Inc',
    location: 'Remote',
    description: 'Backend role',
    salary: '$110k-$140k',
  },
];

const mockProps = {
  jobs: mockJobs,
  userId: 'user123',
  onStackEmpty: jest.fn(),
  onError: jest.fn(),
};

describe('SwipeDeck', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the first job card initially', () => {
    render(<SwipeDeck {...mockProps} />);
    
    expect(screen.getByText('Tech Co')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
  });

  it('handles right swipe (interest) correctly', async () => {
    render(<SwipeDeck {...mockProps} />);

    // Simulate right swipe
    const card = screen.getByTestId('swipe-card');
    fireEvent.touchStart(card, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchMove(card, { touches: [{ clientX: 200, clientY: 0 }] });
    fireEvent.touchEnd(card);

    await waitFor(() => {
      expect(jobAPI.recordJobInterest).toHaveBeenCalledWith('1', 'user123');
    });

    // Should show next card
    expect(screen.getByText('Tech Inc')).toBeInTheDocument();
  });

  it('handles left swipe (dismiss) correctly', async () => {
    render(<SwipeDeck {...mockProps} />);

    // Simulate left swipe
    const card = screen.getByTestId('swipe-card');
    fireEvent.touchStart(card, { touches: [{ clientX: 200, clientY: 0 }] });
    fireEvent.touchMove(card, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchEnd(card);

    await waitFor(() => {
      expect(jobAPI.dismissJob).toHaveBeenCalledWith('1', 'user123');
    });

    // Should show next card
    expect(screen.getByText('Tech Inc')).toBeInTheDocument();
  });

  it('calls onStackEmpty when all cards are swiped', async () => {
    render(<SwipeDeck {...mockProps} />);

    // Swipe through all cards
    for (let i = 0; i < mockJobs.length; i++) {
      const card = screen.getByTestId('swipe-card');
      fireEvent.touchStart(card, { touches: [{ clientX: 0, clientY: 0 }] });
      fireEvent.touchMove(card, { touches: [{ clientX: 200, clientY: 0 }] });
      fireEvent.touchEnd(card);

      await waitFor(() => {
        expect(jobAPI.recordJobInterest).toHaveBeenCalledTimes(i + 1);
      });
    }

    expect(mockProps.onStackEmpty).toHaveBeenCalled();
  });

  it('handles API errors correctly', async () => {
    const error = new Error('API Error');
    (jobAPI.recordJobInterest as jest.Mock).mockRejectedValueOnce(error);

    render(<SwipeDeck {...mockProps} />);

    // Simulate right swipe
    const card = screen.getByTestId('swipe-card');
    fireEvent.touchStart(card, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchMove(card, { touches: [{ clientX: 200, clientY: 0 }] });
    fireEvent.touchEnd(card);

    await waitFor(() => {
      expect(mockProps.onError).toHaveBeenCalledWith(error);
    });
  });

  it('matches snapshot', () => {
    const { container } = render(<SwipeDeck {...mockProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
