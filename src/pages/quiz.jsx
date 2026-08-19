import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

function Quiz() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // const email = localStorage.getItem('token'); // Holds the logged-in user's email identifier
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  const initialCategory = location.state?.categoryId || searchParams.get("categoryId") || "";
  const [categoryId, setCategoryId] = useState(initialCategory);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data || []))
      .catch(() => setError("Unable to load categories. Please try again."));
    if (initialCategory) {
      getQuestionsForCategory(initialCategory);
    }
  }, []);

  const handleCategorySelect = (event) => {
    const chosenValue = event.target.value;
    const matchedCategory = categories.find((cat) => {
      return cat.category_name === chosenValue || String(cat.id) === String(chosenValue);
    });
    if (matchedCategory) {
      setCategoryId(matchedCategory.id);
      getQuestionsForCategory(matchedCategory.id);
    } else {
      setCategoryId("");
    }
  };

  const getQuestionsForCategory = (categoryId) => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/questions/${categoryId}`)
      .then((res) => {
        if (!res.data || res.data.length === 0) {
          alert("No questions found for this category!");
          setLoading(false);
          return;
        }

        let fetchedQuestions = [...res.data];
        if (fetchedQuestions.length > 10) {
          fetchedQuestions = fetchedQuestions.slice(0, 10);
        }
        setQuestions(fetchedQuestions);
        setCurrentQuestion(0);
        setSelectedAnswer("");
        setScore(0);
        setTimeSeconds(0);
        setQuizStarted(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!quizStarted) return;

    const timer = setInterval(() => {
      setTimeSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted]);

  const selectedCategory = categories.find(
    (cat) => String(cat.id) === String(categoryId)
  );

  const categoryLabel = categories.find(
    (cat) => String(cat.id) === String(categoryId)
  )?.category_name || "Unknown Category";

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // ASYNC PERSISTENCE: Push data records safely to backend MySQL database 
  const finishQuiz = async (finalScore) => {
    if (!email) {
      alert("Cannot save score: You are not logged in.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/history/save", {
        email: email,
        category: categoryId ? categoryId : categoryLabel,
        totalQuestions: questions.length,
        correctAnswers: finalScore
      });
    } catch (err) {
      console.error("Could not archive historical quiz run data:", err);
    } finally {
      setLoading(false);

      // FIX: Reactivate navigation redirection to push users to the profile page view
      navigate("/profile", {
        state: {
          score: finalScore,
          totalQuestions: questions.length,
          category: categoryLabel,
          time: formatTime(timeSeconds),
        },
      });
    }
  };
  // console.log(email);
  const nextQuestion = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].answer;
    const updatedScore = score + (isCorrect ? 1 : 0);

    // If there are more questions left in the stack
    if (currentQuestion < questions.length - 1) {
      setScore(updatedScore);
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      // Last question completed -> Stop UI interaction and commit to DB
      setQuizStarted(false);
      setScore(updatedScore); // Sync local state for safety
      finishQuiz(updatedScore);
    }
  };

  if (error && !categoryId) {
    return (
      <div className="quiz-container">
        <h2>Quiz</h2>
        <p>{error}</p>
        <button type="button" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }
  const handlebackToDashboard = () => {
    if (window.confirm("Are you sure you want to exit the quiz? Your progress will not be saved.")) {
      navigate('/dashboard');
    }
  }
  if (loading) {
    return (
      <div className="quiz-container">
        <h2>Saving results & loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-grid">
        <main className="quiz-main">
          {!selectedCategory && !questions.length ? (
            <div className="quiz-category-picker">
              <label htmlFor="category-select">Select Category</label>
              <select
                id="category-select"
                value={categoryId}
                onChange={handleCategorySelect}
              >
                <option value="">Choose a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            </div>
          ) : (
            <div>
              <div className="quiz-header">
                <div className="quiz-actions">
                  <div className="category-info">
                    <div className="eyebrow">
                      <h2>Topic : {categoryLabel}</h2>
                      <h2>Timer: {formatTime(timeSeconds)}</h2>
                    </div>
                  </div>
                </div>

                <div className="question-card">
                  <h3>{currentQuestion + 1}. {questions[currentQuestion]?.question}</h3>
                  <div className="option-box">
                    {['option1', 'option2', 'option3', 'option4'].map((optionKey) => (
                      <label key={optionKey} className="option-item">
                        <input
                          type="radio"
                          name="option"
                          value={questions[currentQuestion]?.[optionKey] || ""}
                          checked={selectedAnswer === questions[currentQuestion]?.[optionKey]}
                          onChange={(e) => setSelectedAnswer(e.target.value)}
                        />
                        {questions[currentQuestion]?.[optionKey]}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="quiz-actions-next">
                  <button type="button" onClick={nextQuestion} disabled={!selectedAnswer}>
                    {currentQuestion === questions.length - 1 ? "Submit Answer" : "Next Question"}
                  </button>
                  <button type="button" onClick={handlebackToDashboard}>
                    Back to Dashboard
                  </button>

                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Quiz;