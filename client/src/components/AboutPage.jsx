// src/components/AboutPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const AboutPage = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="card-title text-center text-primary mb-4">
                About Real-Time Chat
              </h2>
              <p className="card-text text-center mb-4">
                Welcome to our simple real-time chat application! Connect with others by joining or creating chat rooms.
              </p>
              <div className="text-center mb-4">
                <p className="fw-bold">Features:</p>
                <ul className="list-unstyled text-muted">
                  <li>Join specific chat rooms using an ID.</li>
                  <li>See messages from others in real-time.</li>
                  <li>Simple and clean interface.</li>
                </ul>
              </div>
              <div className="text-center">
                {/* Use Link component to navigate to the /join route */}
                <Link to="/join" className="btn btn-primary btn-lg">
                  Join a Chat Room Now
                </Link>
              </div>
              <hr className="my-4" />
              <p className="text-center small text-muted">
                Built with React, Socket.IO, and Bootstrap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;