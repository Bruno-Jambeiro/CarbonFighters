import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/forms/formInput';
import FormSubmitButton from '../components/forms/formSubmitButton';
import carbonFightersLogo from '../assets/carbonfighters.png';
import { authApi, saveAuthData } from '../services/api';


const Login: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '', // Can be CPF or Email
    password: ''
  });

  const [errors, setErrors] = useState({
    identifier: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);

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
    const newErrors = { identifier: '', password: '' };
    let isValid = true;

    if (!formData.identifier) {
      newErrors.identifier = 'CPF or Email is required';
      isValid = false;
    }
    // No need to validate format here - backend will handle it

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
        // Determine if identifier is CPF (only digits) or email (contains @)
        const isCpf = /^\d+$/.test(formData.identifier);
        
        const loginData = {
          ...(isCpf ? { cpf: formData.identifier } : { email: formData.identifier }),
          password: formData.password,
        };

        const data = await authApi.login(loginData);

        console.log('Login successful:', data);
        
        // Save token and user data
        saveAuthData(data.token, data.user);
        
        navigate("/dashboard");
      } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        setErrors({
          identifier: errorMessage,
          password: ''
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-green-50 to-blue-100 lg:flex-row flex-col">
      {/* Left side - Login Form */}
      <div className="flex items-center justify-center lg:w-1/2 w-full h-full">
        <div className="flex flex-col gap-8 w-full max-w-md">
          <div className="text-center">
            <Link to="/" className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors cursor-pointer">
              <img src={carbonFightersLogo} alt="Carbon Fighters Logo" />
            </Link>
            <h2 className="mb-2 text-4xl font-bold text-gray-900 leading-tight">
              Welcome back to Carbon Fighters
            </h2>
            <p className="text-lg text-gray-500">
              Sign in to continue your environmental journey
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <FormInput
              id="identifier"
              name="CPF or Email"
              autoComplete='username'
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your CPF or Email"
              error={errors.identifier}
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

            <FormSubmitButton disabled={isLoading}>Sign In</FormSubmitButton>

            <div className="flex flex-col gap-3">
              <div className="text-center text-gray-500 text-base">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-green-500 hover:text-green-600">Sign up here</Link>
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
