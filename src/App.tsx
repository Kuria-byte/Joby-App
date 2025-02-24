import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes and Route
import SwipeDeck from './components/SwipeDeck/SwipeDeck';
import Home from './pages/Home/Home';
import Header from './components/Header'; // Import Header
import Footer from './components/Footer'; // Import Footer
import UserProfile from './pages/Profile/UserProfile'; // Adjust the import path
import { Job } from './services/api'; // Adjust the import path as necessary
import { auth, db } from './firebaseConfig'; // Import Firebase configuration

const App: React.FC = () => {
  // Dummy job data for demonstration
  const [jobs, setJobs] = useState<Job[]>([
    { id: '1', title: 'Software Engineer', company: 'Tech Corp', location: 'San Francisco, CA', description: 'Great opportunity', salary: 'KES 100,000', imageUrl: '', postedDate: '', jobType: 'Full-time', requirements: 'Experience with JavaScript and React.' },
    { id: '2', title: 'Product Manager', company: 'Innovate LLC', location: 'New York, NY', description: 'Lead product development', salary: 'KES 120,000', imageUrl: '', postedDate: '', jobType: 'Full-time', requirements: 'Experience with product management.' },
    { id: '3', title: 'Data Scientist', company: 'Data Insights', location: 'Remote', description: 'Analyze data and provide insights', salary: 'KES 110,000', imageUrl: '', postedDate: '', jobType: 'Contract', requirements: 'Experience with data analysis.' },
    { id: '4', title: 'UX Designer', company: 'Creative Solutions', location: 'Los Angeles, CA', description: 'Design user-friendly interfaces', salary: 'KES 95,000', imageUrl: '', postedDate: '', jobType: 'Part-time', requirements: 'Experience with design tools.' },
    { id: '5', title: 'DevOps Engineer', company: 'Cloud Services', location: 'Austin, TX', description: 'Manage cloud infrastructure', salary: 'KES 115,000', imageUrl: '', postedDate: '', jobType: 'Full-time', requirements: 'Experience with cloud platforms.' },
    // Add more job objects as needed
  ]);

  const handleStackEmpty = () => {
    console.log('No more jobs to show');
  };

  return (
    <Provider store={store}>
      <Router>
        <div>
          <Header /> {/* Render Header */}
          <Routes>
          {/* <Route path="/" element={<Home />} /> Render Home component on startup */}
          <Route path="/" element={<SwipeDeck jobs={jobs} userId="dummyUserId" onStackEmpty={handleStackEmpty} />} />
          <Route path="/user-profile" element={<UserProfile />} /> {/* Ensure this route is defined */}
        </Routes>
        </div>
        <Footer /> {/* Move Footer here to render at the bottom of each page */}
      </Router>
    </Provider>
  );
};

export default App;
