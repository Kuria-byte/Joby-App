import React from 'react';
import './JobCard.css';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  description: string;
}

const JobCard: React.FC<JobCardProps> = ({ title, company, location, description }) => {
  return (
    <div className="job-card">
      <h2>{title}</h2>
      <h3>{company}</h3>
      <p className="location">{location}</p>
      <p className="description">{description}</p>
    </div>
  );
};

export default JobCard;
