import { Link } from "react-router-dom";
import { useState, type ChangeEvent, type FormEvent } from "react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dob: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name as keyof FormData, value);
    if (name === "password") {
      evaluatePasswordStrength(value);
    }
  };

  const validateField = (name: keyof FormData, value: string) => {
    let error = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (name) {
      case "name":
        if (!value.trim()) error = "Full Name is required";
        break;
      case "email":
        if (!emailRegex.test(value)) error = "Invalid email format";
        break;
      case "phone":
        if (!value.trim()) error = "Phone number is required";
        else if (!value.trim().match(/^\d+$/)) error = "Type only numbers";
        break;
      case "password":
        if (value.length < 6) error = "Password must be at least 6 characters";
        else if (!/[A-Z]/.test(value)) error = "Password must contain at least one uppercase letter";
        else if (!/[0-9]/.test(value)) error = "Password must contain at least one number";
        else if (!/[^A-Za-z0-9]/.test(value)) error = "Password must contain at least one special character";
        break;
      case "confirmPassword":
        if (value !== form.password) error = "Passwords do not match";
        break;
      case "dob":
        if (!value) error = "Date of birth is required";
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = (): boolean => {
    let newErrors: Errors = {};
    (Object.keys(form) as (keyof FormData)[]).forEach((key) => {
      const value = form[key];
      validateField(key, value);
      if (errors[key]) {
        newErrors[key] = errors[key];
      }
    });
    return Object.keys(newErrors).length === 0;
  };

  const evaluatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      alert("Registration successful! ✅");
      console.log(form);
    }
  };

  const strengthColors: string[] = [
    "bg-gray-300",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                onBlur={(e) => validateField("name", e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                onBlur={(e) => validateField("email", e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            {/* Phone */}
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                onBlur={(e) => validateField("phone", e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                onBlur={(e) => validateField("password", e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <div className="flex mt-1 space-x-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded ${
                      level <= passwordStrength
                        ? strengthColors[passwordStrength]
                        : "bg-gray-300"
                    }`}
                  ></div>
                ))}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            {/* Confirm Password */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={(e) => validateField("confirmPassword", e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
            {/* Date of Birth */}
            <div>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                onBlur={(e) => validateField("dob", e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow"
            >
              Register
            </button>
            <div className="w-full mt-2 text-center">
              <Link to="/login" className="text-blue-600 hover:underline">
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
