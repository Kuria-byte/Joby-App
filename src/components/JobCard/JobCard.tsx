import React from 'react';
import './JobCard.css';
import { Job } from '../../services/api';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const {
    title,
    company,
    location,
    description,
    salary = 'Salary not specified',
    imageUrl,
    postedDate,
    jobType
  } = job;

  const defaultImage = '/icons/company-default.svg';

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="company-image">
          <img 
            src={imageUrl || defaultImage} 
            alt={`${company} logo`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultImage;
            }}
          />
        </div>
        <div className="company-info">
          <h3 className="company-name">{company}</h3>
          <div className="job-meta">
            <span className="location">
              <i className="fas fa-map-marker-alt"></i> {location}
            </span>
            {jobType && (
              <span className="job-type">
                <i className="fas fa-briefcase"></i> {jobType}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="job-card-body">
        <h2 className="job-title">{title}</h2>
        <div className="salary-badge">
          <i className="fas fa-money-bill-wave"></i> {salary}
        </div>
        <p className="job-description">{description}</p>
      </div>

      <div className="job-card-footer">
        {postedDate && (
          <span className="posted-date">
            <i className="far fa-clock"></i> Posted {postedDate}
          </span>
        )}
        <div className="action-buttons">
          <button className="btn-more-info">
            <i className="fas fa-info-circle"></i>
            More Info
          </button>
          <button className="btn-apply">
            <i className="fas fa-paper-plane"></i>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
