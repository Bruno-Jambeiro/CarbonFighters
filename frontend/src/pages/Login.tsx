import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../components/forms/formInput';
import FormSubmitButton from '../components/forms/formSubmitButton';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

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
  };

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // TODO: Implement actual login logic here
      console.log('Login attempt:', formData);
      // You would typically make an API call here
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-green-50 to-blue-100 lg:flex-row flex-col">
      {/* Left side - Login Form */}
      <div className="flex items-center justify-center lg:w-1/2 w-full h-full">
        <div className="flex flex-col gap-8 w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="mb-2 text-4xl font-bold text-gray-900 leading-tight">
              Welcome back to CarbonFighters
            </h2>
            <p className="text-lg text-gray-500">
              Sign in to continue your environmental journey
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
              id="password"
              name="Password"
              type='password'
              autoComplete='current-password'
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 bg-white rounded border-gray-300 text-green-500 focus:ring-green-500" />
                <label htmlFor="remember-me" className="text-sm text-gray-700">Remember me</label>
              </div>
              <a href="#" className="text-sm font-medium text-green-500 hover:text-green-600">Forgot your password?</a>
            </div>

            <FormSubmitButton>Sign In</FormSubmitButton>

            <div className="text-center text-gray-500 text-base">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-green-500 hover:text-green-600">Sign up here</Link>
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
          <h1 className="text-5xl font-bold mb-6 leading-tight">Fight Climate Change</h1>
          <p className="text-lg mb-8 opacity-90 leading-relaxed">
            Join thousands of environmental warriors making a real difference in the world.
          </p>
          <div className="grid gap-4 text-left max-w-sm mx-auto">
            {["Track your carbon footprint", "Build sustainable communities", "Make sustainable choices"].map((feature, i) => (
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

export default Login;
