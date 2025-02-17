import React from 'react';
import './JobDetailModal.css'; // Import CSS for modal styling

interface JobDetailModalProps {
  job: {
    title: string;
    company: string;
    description: string;
    location: string;
    salary: string;
  } | null;
  onClose: () => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{job.title}</h2>
        <h3>{job.company}</h3>
        <p>{job.description}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Salary:</strong> {job.salary}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default JobDetailModal;
