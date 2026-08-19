import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function Result() {
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // State for displaying messages to the user
  // Grab the email identifier stored during login
  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");


  // States for live history tracking
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Editable User Profile State
  // const [isEditing, setIsEditing] = useState(false);
  // const [userProfile, setUserProfile] = useState({
  //   // name: email ? email.split('@')[0] : "User Profile", // Fallback name generation
  //   // name: localStorage.getItem('userName') || "User Profile", // Fallback name generation
  //   name: name || "User Profile", // Fallback name generation
  //   email: email || "no-email@example.com",
  //   joined: "Joined 2026"
  // });

  const savedName = localStorage.getItem('userName');
  const savedEmail = localStorage.getItem('userEmail');
  const [isEditing, setIsEditing] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: savedName || "User Profile",
    email: savedEmail || "no-email@example.com",
    joined: "Joined 2026"
  });

  // Fetch performance metrics on mount
  useEffect(() => {
    if (!email) {
      setError("No user session found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/result`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email })
        });
        const data = await response.json();
        console.log("Fetched history response:", data);
        console.log("Response status:", data.status, "Response status text:", data.data);
        if (data.success) {
          setQuizHistory(data.data);
        } else {
          setError(data.message || "Failed to fetch quiz history.");
        }

      }
      catch (err) {
        console.error("Error pulling history:", err);
        setError("Failed to sync your quiz history from the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
  };

  //  console.log(email);
  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/user-profile/update`, {
        email: userProfile.email,
        name: userProfile.name
      });

      if (response.data.success) {
        setIsEditing(false);
        alert("Changes saved to database successfully!");
      } else {
        alert("Server received the data but failed to update the table.");
      }
    } catch (err) {
      console.error("Error updating profile row:", err);
      alert("Failed to save changes to the database.");
    }
  };
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      // setMessage("You have been logged out successfully.");
      navigate("/");
    }
  };
  return (
    <div className="profile-container">
      {/* 4-Part Left Sidebar: User Details */}
      <aside className="profile-sidebar">
        <div className="avatar-section">
          <div className="avatar-placeholder">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          <h3><strong>Name:</strong> {name}</h3>
          <p className="joined-date">{userProfile.joined}</p>
        </div>

        <div className="profile-details">
          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  name="name"
                  value={userProfile.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="button-group">
                <button className="btn btn-save" onClick={handleSave}>Save</button>
                <button className="btn btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="display-info">
              <div className="info-item">
                <span className="info-label">Logged In As</span>
                {email ? email : "Guest User"}
              </div>
              <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </div>

        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>

        <button className="btn btn-secondary" onClick={handleLogout}>
          Log Out
        </button>
      </aside>

      {/* 8-Part Right Content Pane: Live Database Table */}
      <main className="results-content">
        <div className="content-card">
          <h2>Quiz Performance History</h2>
          <p className="subtitle">Real-time summaries extracted directly from your database logs.</p>
          <div className="table-responsive">
            {loading ? (
              <p className="loading-text">Synchronizing records...</p>
            ) : error ? (
              <p className="error-text">{error}</p>
            ) : quizHistory.length === 0 ? (
              <p className="no-data-text">No quiz runs found in database table.</p>
            ) : (

              <table className="results-table">
                <thead>
                  <tr>
                    <th>Attempt ID</th>
                    <th>Topic / Category</th>
                    <th>Score Achieved</th>
                  </tr>
                </thead>
                <tbody>
                  {quizHistory.map((quiz, key) => (
                    <tr key={quiz.attempt_id}>
                      <td className="text-muted">{key + 1}</td>
                      <td className="font-semibold">{quiz.category}</td>
                      <td>
                        <span className="score-badge">
                          {quiz.correct_answers} / {quiz.total_questions}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Result;