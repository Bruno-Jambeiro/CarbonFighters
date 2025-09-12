import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../components/forms/formInput';
import FormSubmitButton from '../components/forms/formSubmitButton';
import PasswordStrengthBar from '../components/passwordStrengthBar';
import PasswordRequirements from '../components/passwordRequeriments';
import SideBar from '../components/signUpSideBar';
import carbonFightersLogo from '../assets/carbonfighters.png';
import { validateDate, validateEmailFormat, validatePasswordStrength } from '../utils/validations.utils';
import RedirectingPopup from '../components/redirectingPopup';


export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date_of_birth: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date_of_birth: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showRequirements, setShowRequirements] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Handle password requirements visibility
    if (name === 'password') {
      const allRequirementsMet = validatePasswordStrength(value).length === 0;
      if (allRequirementsMet && showRequirements) {
        // Hide requirements when password meets all criteria (with delay)
        setTimeout(() => setShowRequirements(false), 500);
      } else if (!allRequirementsMet && !showRequirements) {
        // Show requirements again if password becomes invalid
        setShowRequirements(true);
      }
    }

  };

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      date_of_birth: '',
      password: '',
      confirmPassword: ''
    };
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else {
      let error = validateEmailFormat(formData.email)
      if (error !== null) {
        newErrors.email = error;
        isValid = false;
      }
    }

    if (formData.phone.replace(/\D/g, '').length !== 11) {
      newErrors.phone = "Enter a valid phone number (00) 00000-0000";

      isValid = false;
    }

    let dateValidation = validateDate(formData.date_of_birth)
    if (dateValidation !== null) {
      newErrors.date_of_birth = dateValidation
      isValid = false;
    }

    let pwdValidation = validatePasswordStrength(formData.password)
    if (pwdValidation.length > 0) {
      newErrors.password = pwdValidation.join(', ')
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: formData.firstName + ' ' + formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            date_of_birth: formData.date_of_birth,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('session_token', data.token);

          setShowPopup(true);
        } else {
          console.log(response)
          const errorData = await response.json();
          setErrors({
            firstName: '',
            lastName: '',
            email: errorData.error || 'Registration failed',
            phone: '',
            date_of_birth: '',
            password: '',
            confirmPassword: ''
          });
        }
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({
          firstName: '',
          lastName: '',
          email: 'Network error. Please try again.',
          phone: '',
          date_of_birth: '',
          password: '',
          confirmPassword: ''
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-green-50 to-blue-100 lg:flex-row flex-col">
      {/* Left side - Sign Up Form */}
      <div className="h-screen p-8 overflow-y-auto lg:w-1/2 w-full">
        <div className="flex flex-col items-center justify-center gap-8 min-w-full max-w-xl">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <img src={carbonFightersLogo} alt="Carbon Fighters Logo" />
            </div>
            <h2 className="mb-2 text-4xl font-bold text-gray-900 leading-tight">Join Carbon Fighters</h2>
            <p className="text-lg text-gray-500">Create your account and start making a difference</p>
          </div>

          <RedirectingPopup active={showPopup} text="Account created successfully! Redirecting..." target="/home" />

          <form className="flex flex-col gap-6 w-3/5" onSubmit={handleSubmit}>
            <FormInput
              id="firstName"
              name="First Name"
              autoComplete='given-name'
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              error={errors.firstName}
            />
            <FormInput
              id="lastName"
              name="Last Name"
              autoComplete='family-name'
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              error={errors.lastName}
            />
            <FormInput
              id="email"
              name="Email Address"
              autoComplete='email'
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.email}
            />
            <FormInput
              id="phone"
              name="Phone Number"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              error={errors.phone}
              formatter={(value: string): string => {
                const cleaned = value.replace(/\D/g, '');
                if (cleaned.length === 0) return '';
                if (cleaned.length <= 2) return `(${cleaned}`;
                if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
                if (cleaned.length <= 11) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
                return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
              }}
            />
            <FormInput
              id="date_of_birth"
              name="Date of Birth"
              autoComplete='bday'
              value={formData.date_of_birth}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
              error={errors.date_of_birth}
              formatter={(value: string): string => {
                const cleaned = value.replace(/\D/g, '');
                if (cleaned.length <= 2) return cleaned;
                if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
                return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
              }}
            />

            {/* Password Requirements Section */}
            <div className="space-y-4">


              <FormInput
                id="password"
                name="Password"
                type='password'
                autoComplete='new-password'
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                error={errors.password}
              />
              <PasswordStrengthBar password={formData.password} />

              {showRequirements && <PasswordRequirements password={formData.password} />}
            </div>


            <FormInput
              id="confirmPassword"
              name="Confirm Password"
              type='password'
              autoComplete='new-password'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
            />
            <FormSubmitButton disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </FormSubmitButton>

            <div className="text-center text-gray-500 text-base">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-green-500 hover:text-green-600">Sign in here</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Hero Image/Content */}
      <SideBar />
    </div>

  );
};