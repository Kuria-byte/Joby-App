import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; 
import SwipeDeck from './components/SwipeDeck/SwipeDeck';
import Header from './components/Header'; // Import Header
import Footer from './components/Footer'; // Import Footer
import UserProfile from './components/UserProfile'; // Adjust the import path
import { Job } from './services/api'; // Adjust the import path as necessary
import { auth, db } from './firebaseConfig'; // Import Firebase configuration

const App: React.FC = () => {
  // Dummy job data for demonstration
  const [jobs, setJobs] = useState<Job[]>([
    { id: '1', title: 'Software Engineer', company: 'Tech Corp', location: 'San Francisco, CA', description: 'Great opportunity', salary: '100000', imageUrl: '', postedDate: '', jobType: 'Full-time' },
    { id: '2', title: 'Product Manager', company: 'Innovate LLC', location: 'New York, NY', description: 'Lead product development', salary: '120000', imageUrl: '', postedDate: '', jobType: 'Full-time' },
    { id: '3', title: 'Data Scientist', company: 'Data Insights', location: 'Remote', description: 'Analyze data and provide insights', salary: '110000', imageUrl: '', postedDate: '', jobType: 'Contract' },
    { id: '4', title: 'UX Designer', company: 'Creative Solutions', location: 'Los Angeles, CA', description: 'Design user-friendly interfaces', salary: '95000', imageUrl: '', postedDate: '', jobType: 'Part-time' },
    { id: '5', title: 'DevOps Engineer', company: 'Cloud Services', location: 'Austin, TX', description: 'Manage cloud infrastructure', salary: '115000', imageUrl: '', postedDate: '', jobType: 'Full-time' },
    // Add more job objects as needed
  ]);

  const handleStackEmpty = () => {
    console.log('No more jobs to show');
  };

  return (
    <Router>
      <div>
        <Header /> {/* Render Header */}
        <SwipeDeck jobs={jobs} userId="dummyUserId" onStackEmpty={handleStackEmpty} />
        <UserProfile /> {/* Render UserProfile component */}
        <Footer /> {/* Render Footer */}
      </div>
    </Router>
  );
};

export default App;
