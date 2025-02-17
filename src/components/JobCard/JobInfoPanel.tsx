import React from 'react';
import './JobInfoPanel.css'; // Import CSS for styling

interface JobInfoPanelProps {
  job: {
    title: string;
    company: string;
    description: string;
    requirements: string;
    location: string;
    salary: string;
  };
  onClose: () => void;
}

const JobInfoPanel: React.FC<JobInfoPanelProps> = ({ job, onClose }) => {
  return (
    <div className="job-info-panel">
      <button className="close-button" onClick={onClose}>X</button>
      <h2>{job.title}</h2>
      <h3>{job.company}</h3>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> {job.salary}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Requirements:</strong> {job.requirements}</p>
      <button className="apply-button">Apply Now</button>
    </div>
  );
};

export default JobInfoPanel;
