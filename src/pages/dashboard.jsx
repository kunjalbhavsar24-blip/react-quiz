import '../App.css';
// import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");


  const quizzes = [
    {
      title: 'General Knowledge',
      description: 'Test your speed and trivia skills with 15 fun questions.',
      level: 'Beginner',
      time: '10 min',
      categoryId: () => 1,
    },
    {
      title: 'Science Sprint',
      description: 'Challenge yourself with a quick science round.',
      level: 'Intermediate',
      time: '10 min',
      categoryId: () => 3,
    },
    {
      title: 'Computer Science Challenge',
      description: 'Revisit key moments from the past in a timed quiz.',
      level: 'Advanced',
      time: '10 min',
      categoryId: () => 4,
    },
  ];

  const activity = [
    'Completed “Math Challenge” with 92% score',
    'Unlocked a new badge: “Speed Runner”',
    'Joined a new quiz room for tomorrow’s contest',
  ];
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      navigate("/");
    }
  }
  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div className="nav-bar">
            <div className="brand-block">
              <p className="eyebrow">Quiz Hub</p>
              <h1>Ready to sharpen your mind?</h1>
            </div>

            <nav className="nav-links">
              <button type="button" onClick={() => navigate('/dashboard')}>Home</button>
              <button type="button" onClick={() => navigate('/quiz')}>Quiz</button>
              <button type="button" onClick={() => navigate('/profile')}>Profile</button>
              <button className="button" onClick={handleLogout}>Log Out </button>
            </nav>
          </div>
        </header>

        <div className="dashboard-grid">
          <section className="main-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Featured</p>
                <h2>Popular Quizzes</h2>
              </div>
            </div>

            <div className="quiz-list">
              {quizzes.map((quiz) => (
                <article className="quiz-card" key={quiz.title}>
                  <div>
                    <h3>{quiz.title}</h3>
                    <p>{quiz.description}</p>
                  </div>
                  <div className="quiz-meta">
                    <span>{quiz.level}</span>
                    <span>{quiz.time}</span>
                    <div className="start-quiz-button">
                      <button type="button" onClick={() => navigate('/quiz?categoryId=' + quiz.categoryId())} >Start Quiz</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="side-panel">
            <div className="panel-card">
              <div className="panel-heading compact">
                <div>
                  <p className="eyebrow">Best Performance</p>
                  <h2>Activity</h2>
                </div>
              </div>
              <ul className="activity-list">
                {activity.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;