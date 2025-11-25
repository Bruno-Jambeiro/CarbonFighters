import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, actionsApi } from '../services/api';
import type { AuthResponse } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SingleAction from '../components/SingleAction';

// Define action types
interface Action {
  id: number;
  activity_title: string;
  activity_description: string;
  activity_type: string;
  activity_date: string;
  image: string; //BASE64 image string
  validated: boolean;
  // For display purposes, we'll compute these from the data
  title?: string;
  description?: string;
  actionType?: string;
  createdAt?: string;
}

const actionTypes = [
  { value: 'transport', label: '🚲 Sustainable Transport', color: 'from-blue-500 to-cyan-500' },
  { value: 'energy', label: '⚡ Energy Conservation', color: 'from-yellow-500 to-orange-500' },
  { value: 'waste', label: '♻️ Waste Reduction', color: 'from-green-500 to-emerald-500' },
  { value: 'food', label: '🌱 Plant-Based Meal', color: 'from-purple-500 to-pink-500' },
  { value: 'water', label: '💧 Water Conservation', color: 'from-blue-400 to-blue-600' },
  { value: 'other', label: '🌍 Other Eco-Action', color: 'from-gray-500 to-gray-600' },
];

const transportTypes = [
  { value: 'electric', label: 'Electric Vehicle' },
  { value: 'ethanol', label: 'Ethanol Vehicle (Flex Fuel)' },
  { value: 'bicycle', label: 'Bicycle' },
  { value: 'walking', label: 'Walking' },
];

const calculateTransportCO2 = (transportType: string, distanceKm: number): number => {
  const avgCarEmissions = 0.12; // kg CO2 per km for average gasoline car
  
  const emissionFactors: Record<string, number> = {
    'electric': 0.05,
    'ethanol': 0.08,
    'bicycle': 0,
    'walking': 0
  };
  
  const transportEmissions = emissionFactors[transportType] || 0;
  const savedEmissions = (avgCarEmissions - transportEmissions) * distanceKm;
  
  return Math.max(0, savedEmissions); // ensure non-negative values
};

const calculateEnergyCO2 = (kwhSaved: number): number => {
  const emissionFactor = 0.5; // kg CO2 per kWh
  return kwhSaved * emissionFactor;
};

const calculateWasteCO2 = (kgWasteReduced: number): number => {
  const emissionFactor = 0.7; // kg CO2 per kg of waste
  return kgWasteReduced * emissionFactor;
};

const calculateFoodCO2 = (mealsCount: number): number => {
  const emissionSavedPerMeal = 6.3; // kg CO2 saved per plant-based meal vs meat meal
  return mealsCount * emissionSavedPerMeal;
};

const calculateWaterCO2 = (litersSaved: number): number => {
  const emissionFactor = 0.0003; // kg CO2 per liter saved
  return litersSaved * emissionFactor;
};

function Activities() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);

  // State for the component
  const [myActions, setMyActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the form
  const [actionTitle, setActionTitle] = useState('');
  const [actionDescription, setActionDescription] = useState('');
  const [selectedActionType, setSelectedActionType] = useState('transport');
  const [carbonSaved, setCarbonSaved] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Category-specific fields
  const [transportType, setTransportType] = useState('electric');
  const [distance, setDistance] = useState('');
  const [energySaved, setEnergySaved] = useState('');
  const [wasteReduced, setWasteReduced] = useState('');
  const [mealsCount, setMealsCount] = useState('');
  const [waterSaved, setWaterSaved] = useState('');

  // Check authentication and fetch user's actions
  useEffect(() => {
    const { token, user: userData } = getAuthData();
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(userData);
    fetchActions();
  }, [navigate]);

  // Auto-calculate CO2 based on category-specific fields
  useEffect(() => {
    if (selectedActionType === 'other') {
      // For "other" category, don't auto-calculate - let user input manually
      return;
    }

    let calculatedCO2 = 0;

    switch (selectedActionType) {
      case 'transport':
        const dist = parseFloat(distance);
        if (!isNaN(dist) && dist > 0) {
          calculatedCO2 = calculateTransportCO2(transportType, dist);
        }
        break;
      case 'energy':
        const kwh = parseFloat(energySaved);
        if (!isNaN(kwh) && kwh > 0) {
          calculatedCO2 = calculateEnergyCO2(kwh);
        }
        break;
      case 'waste':
        const kg = parseFloat(wasteReduced);
        if (!isNaN(kg) && kg > 0) {
          calculatedCO2 = calculateWasteCO2(kg);
        }
        break;
      case 'food':
        const meals = parseFloat(mealsCount);
        if (!isNaN(meals) && meals > 0) {
          calculatedCO2 = calculateFoodCO2(meals);
        }
        break;
      case 'water':
        const liters = parseFloat(waterSaved);
        if (!isNaN(liters) && liters > 0) {
          calculatedCO2 = calculateWaterCO2(liters);
        }
        break;
    }

    // Round to 2 decimal places
    setCarbonSaved(calculatedCO2 > 0 ? calculatedCO2.toFixed(2) : '');
  }, [selectedActionType, transportType, distance, energySaved, wasteReduced, mealsCount, waterSaved]);

  // Reset category-specific fields when action type changes
  useEffect(() => {
    setTransportType('electric');
    setDistance('');
    setEnergySaved('');
    setWasteReduced('');
    setMealsCount('');
    setWaterSaved('');
    setCarbonSaved('');
  }, [selectedActionType]);

  /**
   * Fetches the user's actions and updates the state.
   */
  const fetchActions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const actions = await actionsApi.getMyActions();
      setMyActions(actions);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles image file selection and preview creation.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    // Clean up previous preview URL to avoid memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    // Create new preview URL if file is selected
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  /**
   * Clears the selected file and preview.
   */
  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Clean up preview URL on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /**
   * Handles the submission of the "Post New Action" form.
   */
  const handlePostAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validation
    if (!actionTitle.trim()) {
      setFormError('Action title is required.');
      return;
    }
    if (!actionDescription.trim()) {
      setFormError('Action description is required.');
      return;
    }

    // Validate category-specific fields
    switch (selectedActionType) {
      case 'transport':
        if (!distance || parseFloat(distance) <= 0) {
          setFormError('Please enter a valid distance traveled.');
          return;
        }
        break;
      case 'energy':
        if (!energySaved || parseFloat(energySaved) <= 0) {
          setFormError('Please enter a valid amount of energy saved.');
          return;
        }
        break;
      case 'waste':
        if (!wasteReduced || parseFloat(wasteReduced) <= 0) {
          setFormError('Please enter a valid amount of waste reduced.');
          return;
        }
        break;
      case 'food':
        if (!mealsCount || parseFloat(mealsCount) <= 0) {
          setFormError('Please enter a valid number of plant-based meals.');
          return;
        }
        break;
      case 'water':
        if (!waterSaved || parseFloat(waterSaved) <= 0) {
          setFormError('Please enter a valid amount of water saved.');
          return;
        }
        break;
    }

    if (!carbonSaved || parseFloat(carbonSaved) <= 0) {
      setFormError('Please enter a valid carbon saved amount.');
      return;
    }
    if (!selectedFile) {
      setFormError('Please upload an evidence photo of your action.');
      return;
    }

    try {
        // Create action via API with file upload using FormData
        await actionsApi.createAction(
          selectedActionType,
          actionTitle,
          actionDescription,
          new Date(),
          selectedFile
        );

        setFormSuccess(`Successfully posted action "${actionTitle}"!`);

        // Clear form
        setActionTitle('');
        setActionDescription('');
        setCarbonSaved('');
        setSelectedFile(null);
        setSelectedActionType('transport');
        
        // Clear category-specific fields
        setTransportType('electric');
        setDistance('');
        setEnergySaved('');
        setWasteReduced('');
        setMealsCount('');
        setWaterSaved('');

        // Clear image preview
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
          setImagePreview(null);
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Refresh the list from the API
        await fetchActions();
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  if (!user) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <Navbar user={user} />
      
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Eco Actions 🌍
          </h1>
          <p className="text-gray-600 mt-2">Share your climate actions and inspire others to make a difference.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --- Post New Action Form --- */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Post New Action</h2>
              
              {/* Form Status Messages */}
              {formError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700">{formError}</p>
                  </div>
                </div>
              )}
              
              {formSuccess && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-700">{formSuccess}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handlePostAction}>
                {/* Action Type */}
                <div className="mb-6">
                  <label htmlFor="actionType" className="block text-sm font-medium text-gray-700 mb-2">
                    Action Category
                  </label>
                  <select
                    id="actionType"
                    value={selectedActionType}
                    onChange={(e) => setSelectedActionType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  >
                    {actionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Title */}
                <div className="mb-6">
                  <label htmlFor="actionTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Action Title
                  </label>
                  <input
                    type="text"
                    id="actionTitle"
                    value={actionTitle}
                    onChange={(e) => setActionTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Bike to Work Challenge"
                  />
                </div>

                {/* Action Description */}
                <div className="mb-6">
                  <label htmlFor="actionDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="actionDescription"
                    rows={4}
                    value={actionDescription}
                    onChange={(e) => setActionDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Describe your eco-friendly action and its impact..."
                  />
                </div>

                {/* Category-Specific Fields */}
                {selectedActionType === 'transport' && (
                  <>
                    <div className="mb-6">
                      <label htmlFor="transportType" className="block text-sm font-medium text-gray-700 mb-2">
                        Type of Transportation <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="transportType"
                        value={transportType}
                        onChange={(e) => setTransportType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        required
                      >
                        {transportTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-2">
                        Distance Traveled (km) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        id="distance"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="e.g., 15.5"
                        required
                      />
                    </div>
                  </>
                )}

                {selectedActionType === 'energy' && (
                  <div className="mb-6">
                    <label htmlFor="energySaved" className="block text-sm font-medium text-gray-700 mb-2">
                      Energy Saved (kWh) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      id="energySaved"
                      value={energySaved}
                      onChange={(e) => setEnergySaved(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="e.g., 10.5"
                      required
                    />
                  </div>
                )}

                {selectedActionType === 'waste' && (
                  <div className="mb-6">
                    <label htmlFor="wasteReduced" className="block text-sm font-medium text-gray-700 mb-2">
                      Waste Reduced (kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      id="wasteReduced"
                      value={wasteReduced}
                      onChange={(e) => setWasteReduced(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="e.g., 5.0"
                      required
                    />
                  </div>
                )}

                {selectedActionType === 'food' && (
                  <div className="mb-6">
                    <label htmlFor="mealsCount" className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Plant-Based Meals <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      id="mealsCount"
                      value={mealsCount}
                      onChange={(e) => setMealsCount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="e.g., 3"
                      required
                    />
                  </div>
                )}

                {selectedActionType === 'water' && (
                  <div className="mb-6">
                    <label htmlFor="waterSaved" className="block text-sm font-medium text-gray-700 mb-2">
                      Water Saved (liters) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      id="waterSaved"
                      value={waterSaved}
                      onChange={(e) => setWaterSaved(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="e.g., 50.0"
                      required
                    />
                  </div>
                )}

                {/* Carbon Saved */}
                <div className="mb-6">
                  <label htmlFor="carbonSaved" className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Carbon Saved (kg CO₂)
                    {selectedActionType !== 'other' && (
                      <span className="ml-2 text-xs text-gray-500">(Auto-calculated)</span>
                    )}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="carbonSaved"
                    value={carbonSaved}
                    onChange={(e) => setCarbonSaved(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="0.0"
                    readOnly={selectedActionType !== 'other'}
                    disabled={selectedActionType !== 'other'}
                  />
                  {selectedActionType !== 'other' && (
                    <p className="mt-1 text-xs text-gray-500">
                      This value is automatically calculated based on your input
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <label htmlFor="actionImage" className="block text-sm font-medium text-gray-700 mb-2">
                    Evidence Photo <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="mt-4">
                      <label htmlFor="actionImage" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload a photo of your action
                        </span>
                        <input
                          id="actionImage"
                          name="actionImage"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  {selectedFile && (
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm text-green-600 truncate">
                        Selected: {selectedFile.name}
                      </p>
                      <button
                        type="button"
                        onClick={clearSelectedFile}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                        aria-label="Remove selected image"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {imagePreview && (
                    <div className="mt-4">
                      <div className="relative w-full max-h-64 overflow-hidden rounded-lg border border-gray-200">
                        <img
                          src={imagePreview}
                          alt="Preview of uploaded action evidence"
                          className="w-full h-full object-contain bg-gray-50"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <svg className="h-5 w-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Post Action
                </button>
              </form>
            </div>
          </div>

          {/* --- My Activities List --- */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Actions</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                {myActions.length} actions
              </span>
            </div>
            
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-lg text-gray-600">Loading your actions...</div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            {!isLoading && !error && (
              <div className="space-y-4">
                {myActions.length > 0 ? (
                  myActions.map((action) => (
                    <SingleAction key={action.id} action={action} isOwnAction={true} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🌱</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Actions Yet</h3>
                    <p className="text-gray-600 mb-4">Start making a difference by posting your first eco-action!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Activities;