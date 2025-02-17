import React, { useState } from 'react';
import { auth, db } from '../../firebaseConfig'; // Adjust the import path
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { FaUser, FaBriefcase, FaClipboardList, FaUpload } from 'react-icons/fa';
import './UserProfile.css'; // Import the CSS file

interface SocialLinks {
  linkedin: string;
  twitter: string;
}

interface JobPreferences {
  workType: string;
  industry: string;
  location: string;
  salaryExpectations: string;
  workEnvironment: string;
}

interface EmploymentHistory {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
}

interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

interface Certification {
  name: string;
  issuingOrganization: string;
  date: string;
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dob: string;
  profilePicture: File | null;
  socialLinks: SocialLinks;
  employmentHistory: EmploymentHistory[];
  currentEmployment: boolean;
  skills: string[];
  education: Education[];
  certifications: Certification[];
  jobPreferences: JobPreferences;
  resume: File | null;
  coverLetter: File | null;
}

const UserProfile: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    dob: '',
    profilePicture: null,
    socialLinks: {
      linkedin: '',
      twitter: '',
    },
    employmentHistory: [],
    currentEmployment: false,
    skills: [],
    education: [],
    certifications: [],
    jobPreferences: {
      workType: '',
      industry: '',
      location: '',
      salaryExpectations: '',
      workEnvironment: '',
    },
    resume: null,
    coverLetter: null,
  });

  const handleTogglePreview = () => {
    setIsPreview(!isPreview);
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      console.error('User not authenticated');
      return;
    }

    // Save user data to Firestore
    const userDoc = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userDoc, {
      ...formData,
    });

    // Handle CV upload
    if (formData.resume) {
      const storage = getStorage();
      const cvRef = ref(storage, `cvs/${auth.currentUser.uid}/${formData.resume.name}`);
      await uploadBytes(cvRef, formData.resume);
      console.log('Resume uploaded successfully');
    }

    if (formData.coverLetter) {
      const storage = getStorage();
      const coverLetterRef = ref(storage, `coverLetters/${auth.currentUser.uid}/${formData.coverLetter.name}`);
      await uploadBytes(coverLetterRef, formData.coverLetter);
      console.log('Cover Letter uploaded successfully');
    }

    if (formData.profilePicture) {
      const storage = getStorage();
      const profilePictureRef = ref(storage, `profilePictures/${auth.currentUser.uid}/${formData.profilePicture.name}`);
      await uploadBytes(profilePictureRef, formData.profilePicture);
      console.log('Profile Picture uploaded successfully');
    }

    console.log('User data saved:', formData);
  };

  return (
    <div className="user-profile">
      <h2>User Profile Management</h2>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(step / 4) * 100}%` }}></div>
      </div>
      <button onClick={handleTogglePreview} aria-label={isPreview ? 'Edit Profile' : 'Preview Profile'}>
        {isPreview ? 'Edit Profile' : 'Preview Profile'}
      </button>
      {isPreview ? (
        <div>
          <h3>Profile Preview</h3>
          <p><strong>Name:</strong> {formData.fullName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
          <p><strong>Date of Birth:</strong> {formData.dob}</p>
          <p><strong>LinkedIn:</strong> {formData.socialLinks.linkedin}</p>
          <p><strong>Twitter:</strong> {formData.socialLinks.twitter}</p>
          {/* Display other information as needed */}
        </div>
      ) : (
        <>
          {step === 1 && (
            <div>
              <h3><FaUser />Personal Information</h3>
              <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
              <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
              <input type="date" name="dob" onChange={handleChange} />
              <input type="file" name="profilePicture" accept="image/*" onChange={handleFileChange} />
              <input type="text" name="socialLinks.linkedin" placeholder="LinkedIn URL" onChange={handleChange} />
              <input type="text" name="socialLinks.twitter" placeholder="Twitter URL" onChange={handleChange} />
              <button onClick={handleNextStep}>Next</button>
            </div>
          )}
          {step === 2 && (
            <div>
              <h3> <FaBriefcase />Work Information</h3>
              <input type="text" name="employmentHistory[0].company" placeholder="Company" onChange={handleChange} />
              <input type="text" name="employmentHistory[0].position" placeholder="Position" onChange={handleChange} />
              <input type="date" name="employmentHistory[0].startDate" onChange={handleChange} />
              <input type="date" name="employmentHistory[0].endDate" onChange={handleChange} />
              <button onClick={handleNextStep}>Next</button>
            </div>
          )}
          {step === 3 && (
            <div>
              <h3><FaClipboardList/>Preferences & Goals</h3>
              <input type="text" name="jobPreferences.workType" placeholder="Work Type" onChange={handleChange} />
              <input type="text" name="jobPreferences.industry" placeholder="Industry" onChange={handleChange} />
              <input type="text" name="jobPreferences.location" placeholder="Location" onChange={handleChange} />
              <input type="text" name="jobPreferences.salaryExpectations" placeholder="Salary Expectations" onChange={handleChange} />
              <input type="text" name="jobPreferences.workEnvironment" placeholder="Work Environment" onChange={handleChange} />
              <button onClick={handleNextStep}>Next</button>
            </div>
          )}
          {step === 4 && (
            <div>
              <h3> <FaUpload/>Document Upload</h3>
              <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              <input type="file" name="coverLetter" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              <button onClick={handleSubmit}>Submit</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;
