import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/forms/formInput';
import FormSubmitButton from '../components/forms/formSubmitButton';
import PasswordStrengthBar from '../components/passwordStrengthBar';
import PasswordRequirements from '../components/passwordRequeriments';
import carbonFightersLogo from '../assets/carbonfighters.png';
import { authApi, saveAuthData } from '../services/api';

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cpf: '',
    email: '',
    phone: '',
    birthday: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    cpf: '',
    email: '',
    phone: '',
    birthday: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const [showRequirements, setShowRequirements] = useState(true);

  const checkPasswordRequirements = (password: string) => {
    return password.length >= 8 &&
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/.test(password);
  };

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

    // NEW: Handle password requirements visibility
    if (name === 'password') {
      const allRequirementsMet = checkPasswordRequirements(value);
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
      cpf: '',
      email: '',
      phone: '',
      birthday: '',
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

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF is required';
      isValid = false;
    } else if (!/^\d{11}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF must be 11 digits';
      isValid = false;
    }

    // Email is optional, but validate format if provided
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Phone is optional, but validate format if provided
    if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10-11 digits';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
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
        const registerData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          cpf: formData.cpf,
          password: formData.password,
          ...(formData.email && { email: formData.email }),
          ...(formData.phone && { phone: formData.phone }),
          ...(formData.birthday && { birthday: formData.birthday }),
        };

        const data = await authApi.register(registerData);
        
        // Save token and user data
        saveAuthData(data.token, data.user);
        
        console.log('Registration successful:', data);
        navigate("/dashboard");
      } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        setErrors({
          firstName: '',
          lastName: '',
          cpf: '',
          email: '',
          phone: '',
          birthday: '',
          password: '',
          confirmPassword: errorMessage
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-green-50 to-blue-100 lg:flex-row flex-col">
      {/* Left side - Sign Up Form */}
      <div className="flex items-center justify-center p-8 overflow-y-auto lg:w-1/2 w-full h-full">
        <div className="flex flex-col gap-8 w-full max-w-xl">
          <div className="text-center">
            <Link to="/" className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors cursor-pointer">
              <img src={carbonFightersLogo} alt="Carbon Fighters Logo" />
            </Link>
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
              id="cpf"
              name="CPF"
              autoComplete='off'
              value={formData.cpf}
              onChange={handleChange}
              placeholder="CPF (11 digits)"
              error={errors.cpf}
              maxLength={11}
            />
            <FormInput
              id="email"
              name="Email Address (Optional)"
              autoComplete='email'
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.email}
            />
            <FormInput
              id="phone"
              name="Phone (Optional)"
              autoComplete='tel'
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              error={errors.phone}
              maxLength={11}
            />
            <FormInput
              id="birthday"
              name="Birthday (Optional)"
              type="date"
              autoComplete='bday'
              value={formData.birthday}
              onChange={handleChange}
              placeholder="YYYY-MM-DD"
              error={errors.birthday}
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

              {(showRequirements) && (
                <PasswordRequirements password={formData.password} />
              )}

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

            <div className="flex flex-col gap-3">
              <div className="text-center text-gray-500 text-base">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-green-500 hover:text-green-600">Sign in here</Link>
              </div>
              
              <Link 
                to="/" 
                className="text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Hero Image/Content */}
      <div className="hidden lg:flex w-1/2 h-screen items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 p-12">
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
    </div >
  );
};

export default SignUp;