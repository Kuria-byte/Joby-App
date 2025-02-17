import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig'; // Adjust the import path
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const UserProfile: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cv, setCv] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      console.error('User not authenticated');
      return;
    }

    // Save user data to Firestore
    const userDoc = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userDoc, {
      name,
      email,
    });

    // Handle CV upload
    if (cv) {
      const storage = getStorage();
      const cvRef = ref(storage, `cvs/${auth.currentUser.uid}/${cv.name}`);
      await uploadBytes(cvRef, cv);
      console.log('CV uploaded successfully');
    }

    console.log('User data saved:', { name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setCv(e.target.files ? e.target.files[0] : null)}
      />
      <button type="submit">Save Profile</button>
    </form>
  );
};

export default UserProfile;
