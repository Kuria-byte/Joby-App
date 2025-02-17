import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JobCard from './JobCard';
import { Job } from '../../services/api';


const mockOnInfo = jest.fn();

const mockJob: Job = {
  id: '1',
  title: 'Software Engineer',
  company: 'Tech Corp',
  location: 'San Francisco, CA',
  description: 'Exciting role for a software engineer',
  salary: '$120,000 - $150,000',
  imageUrl: 'https://example.com/logo.png',
  postedDate: '2025-02-11',
  jobType: 'Full-time',
  requirements: 'Experience with JavaScript and React.'
};

describe('JobCard', () => {
  it('renders job information correctly', () => {
    const mockOnLogout = jest.fn();
    render(<JobCard job={mockJob} onInfo={mockOnInfo} />);
    
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText('$120,000 - $150,000')).toBeInTheDocument();
    expect(screen.getByAltText('Tech Corp logo')).toBeInTheDocument();
  });

  it('uses default image when company logo fails to load', () => {
    const mockOnLogout = jest.fn();
    render(<JobCard job={mockJob}  onInfo={mockOnInfo} />);
    
    const img = screen.getByAltText('Tech Corp logo') as HTMLImageElement;
    fireEvent.error(img);
    
    expect(img.src).toContain('/icons/company-default.svg');
  });

  it('renders without optional fields', () => {
    const jobWithoutOptionals: Job = {
      id: '2',
      title: 'Developer',
      company: 'Startup Inc',
      location: 'Remote',
      description: 'Great opportunity',
      salary: 'Not specified', 
      imageUrl: '',
      postedDate: '2025-02-11',
      jobType: 'Full-time' ,
      requirements: 'Experience with JavaScript and React.'
    };

    const mockOnLogout = jest.fn();
    render(<JobCard job={jobWithoutOptionals}  onInfo={mockOnInfo} />);
    
    expect(screen.getByText('Startup Inc')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(screen.getByText('Salary not specified')).toBeInTheDocument();
    expect(screen.queryByText(/Full-time/)).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const mockOnLogout = jest.fn();
    const { container } = render(<JobCard job={mockJob} onInfo={mockOnInfo} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
