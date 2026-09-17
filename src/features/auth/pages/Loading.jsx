// frontend: src/features/auth/pages/Loading.jsx
import React from 'react';

export default function Loading() {
  return (
    <div className="loading-container">
      <style>
        {`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100%;
            padding: 2rem;
            box-sizing: border-box;
            background: linear-gradient(135deg, #163E8C 0%, #0D0D0D 100%);
            font-family: 'Inter', system-ui, sans-serif;
            overflow: hidden;
          }

          .loading-card {
            width: 100%;
            max-width: 600px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 2.5rem;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }

          .loading-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 0.5rem;
          }

          .loading-spinner {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 4px solid rgba(242, 226, 5, 0.1);
            border-top: 4px solid #F2E205; /* Golden Yellow */
            border-right: 4px solid #F2A007; /* Amber Orange */
            animation: spin 1s linear infinite;
            box-shadow: 0 0 15px rgba(242, 160, 7, 0.4);
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .skeleton-group {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .skeleton-row {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .skeleton-box {
            height: 14px;
            border-radius: 8px;
            /* Colorful shimmer sweep */
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.05) 0%,
              rgba(255, 255, 255, 0.15) 20%,
              rgba(242, 226, 5, 0.25) 50%,
              rgba(255, 255, 255, 0.15) 80%,
              rgba(255, 255, 255, 0.05) 100%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite linear;
          }

          .skeleton-title {
            height: 18px;
            width: 120px;
            border-radius: 8px;
            /* Green tinted shimmer for titles */
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.08) 0%,
              rgba(62, 140, 81, 0.3) 50%,
              rgba(255, 255, 255, 0.08) 100%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite linear;
          }

          .skeleton-button {
            width: 100%;
            height: 48px;
            border-radius: 12px;
            margin-top: 0.5rem;
            /* Amber gradient shimmer for button */
            background: linear-gradient(
              90deg,
              rgba(242, 226, 5, 0.1) 0%,
              rgba(242, 160, 7, 0.3) 50%,
              rgba(242, 226, 5, 0.1) 100%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite linear;
          }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>

      <div className="loading-card">
        {/* Header Section with Spinner */}
        <div className="loading-header">
          <div className="loading-spinner"></div>
          <div className="skeleton-box" style={{ width: '200px', height: '24px' }}></div>
          <div className="skeleton-box" style={{ width: '150px', height: '14px' }}></div>
        </div>

        {/* Skeleton Form Groups */}
        <div className="skeleton-group">
          <div className="skeleton-row">
            <div className="skeleton-title"></div>
            <div className="skeleton-box" style={{ width: '100%' }}></div>
            <div className="skeleton-box" style={{ width: '90%' }}></div>
            <div className="skeleton-box" style={{ width: '95%' }}></div>
          </div>

          <div className="skeleton-row">
            <div className="skeleton-title" style={{ width: '100px' }}></div>
            <div className="skeleton-box" style={{ width: '100%' }}></div>
            <div className="skeleton-box" style={{ width: '80%' }}></div>
          </div>

          <div className="skeleton-row">
            <div className="skeleton-title" style={{ width: '140px' }}></div>
            <div className="skeleton-box" style={{ width: '100%' }}></div>
            <div className="skeleton-box" style={{ width: '70%' }}></div>
          </div>

          {/* Simulated Action Button */}
          <div className="skeleton-button"></div>
        </div>
      </div>
    </div>
  );
}