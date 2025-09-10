import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../components/forms/formInput';
import FormSubmitButton from '../components/forms/formSubmitButton';
import PasswordStrengthBar from '../components/passwordStrengthBar';
import PasswordRequirements from '../components/passwordRequeriments';
import carbonFightersLogo from '../assets/carbonfighters.png';
import { validateDate, validateEmailFormat, validatePasswordStrength } from '../utils/validations.utils';

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
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Store token in localStorage or context
          localStorage.setItem('token', data.token);
          // Redirect to dashboard or main app
          console.log('Registration successful:', data);
        } else {
          const errorData = await response.json();
          setErrors({
            firstName: '',
            lastName: '',
            email: errorData.message || 'Registration failed',
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

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
      <div className="hidden lg:flex w-1/2 min-h-screen items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 p-12">
        <div className="text-center text-white max-w-xl">
          <div className="mx-auto mb-8 h-24 w-24">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">Start Your Journey</h1>
          <p className="text-lg mb-8 opacity-90 leading-relaxed">
            Join our community of environmental champions and make a real impact on climate change.
          </p>
          <div className="grid gap-4 text-left max-w-sm mx-auto">
            {["Monitor environmental impact", "Join global initiatives", "Create lasting change"].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <svg className="h-6 w-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
};