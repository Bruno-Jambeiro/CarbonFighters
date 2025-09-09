import React from "react";

interface PasswordRequirementsProps {
    password: string;
}

interface Requirement {
    text: string;
    test: (password: string) => boolean;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
    password,}) => {
const requirements: Requirement[] = [
    {
      text: "Cannot be empty",
      test: (pwd: string) => pwd.length > 0,
    },
    {
      text: "At least 8 characters",
      test: (pwd: string) => pwd.length >= 8,
    },
    {
      text: "Contains uppercase, lowercase, and number",
      test: (pwd: string) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pwd),
    },
  ];

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        Password Requirements:
      </h4>

      {requirements.map((requirement, index) => {
        const isMet = requirement.test(password);

        return (
          <div key={index} className="flex items-center gap-3">
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                isMet
                  ? "bg-green-500 border-green-500"
                  : "border-gray-300 bg-white"
              }`}
            >
              {isMet && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>

            <span
              className={`text-sm transition-colors duration-200 ${
                isMet ? "text-green-700 font-medium" : "text-gray-600"
              }`}
            >
              {requirement.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordRequirements;