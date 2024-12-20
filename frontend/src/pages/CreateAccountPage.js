import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.js';
import NotificationCard from '../components/NotificationCard.js';
import handleRegistration from './CreateAccountPage/handleRegistration.js'; // Import the function

const CreateAccountPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setNotification({
          message: 'Please fill out both first and last names.',
          borderColor: '#8D0C0C',
          bgColor: '#E3D8D8',
          textColor: '#6A0202',
        });
        return false;
      }
    } else if (step === 2) {
      if (!formData.email.trim() || !formData.dob) {
        setNotification({
          message: 'Please provide a valid email and date of birth.',
          borderColor: '#8D0C0C',
          bgColor: '#E3D8D8',
          textColor: '#6A0202',
        });
        return false;
      }
    } else if (step === 3) {
      if (!formData.password || formData.password !== formData.confirmPassword) {
        setNotification({
          message: 'Passwords do not match or are invalid.',
          borderColor: '#8D0C0C',
          bgColor: '#E3D8D8',
          textColor: '#6A0202',
        });
        return false;
      }
      if (!formData.agreeTerms) {
        setNotification({
          message: 'You must agree to the terms and conditions.',
          borderColor: '#8D0C0C',
          bgColor: '#E3D8D8',
          textColor: '#6A0202',
        });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegistration(e, formData, setNotification); // Use the imported function
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Header linkText="Login" linkUrl="/login" />
      <div className="w-full max-w-md">
        <h2 className="text-[20px] font-bold text-center mb-6">
          {step === 1 && 'Tell us your name'}
          {step === 2 && 'Some personal information'}
          {step === 3 && 'Set up a password'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none placeholder:text-placeholderGray placeholder:text-[12px]"
                  placeholder="First Name"
                />
              </div>
              <div>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none placeholder:text-placeholderGray placeholder:text-[12px]"
                  placeholder="Last Name"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none placeholder:text-placeholderGray placeholder:text-[12px]"
                  placeholder="Email"
                />
              </div>
              <div>
                <input
                  type="date"
                  id="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none placeholder:text-placeholderGray placeholder:text-[12px]"
                  placeholder="Password"
                />
              </div>
              <div>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none placeholder:text-placeholderGray placeholder:text-[12px]"
                  placeholder="Confirm Password"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="agreeTerms" className="text-sm">
                  I agree to the{' '}
                  <Link to="/terms" className="text-customPurple hover:underline">
                    terms and conditions
                  </Link>
                </label>
              </div>
            </>
          )}

          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-customPurple text-white rounded hover:bg-[#8060DB]"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-customPurple text-white rounded hover:bg-[#8060DB]"
              >
                Register
              </button>
            )}
          </div>
        </form>

        {notification && (
          <NotificationCard
            message={notification.message}
            borderColor={notification.borderColor}
            bgColor={notification.bgColor}
            textColor={notification.textColor}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
};

export default CreateAccountPage;
