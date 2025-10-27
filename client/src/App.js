import React, { useState } from "react";
import "./App.css";

function App() {
  const [emailText, setEmailText] = useState("");
  const [prediction, setPrediction] = useState("");
  const [predType, setPredType] = useState(""); // "spam" or "ham"
  const [loading, setLoading] = useState(false); // loading state
  const [predicted, setPredicted] = useState(false); // whether current text is already predicted

  const handlePredict = async () => {
    if (!emailText.trim()) return;

    setLoading(true);
    setPrediction("");
    setPredType("");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: emailText }),
      });

      const data = await response.json();
      setPrediction(`Prediction: ${data.prediction}`);
      setPredType(data.prediction.toLowerCase() === "spam" ? "spam" : "ham");
      setPredicted(true); // mark current text as predicted
    } catch (error) {
      console.error(error);
      setPrediction("Error connecting to the server.");
      setPredType("");
      setPredicted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmailText(e.target.value);
    setPrediction(""); // remove previous prediction
    setPredType("");
    setPredicted(false); // allow predict button again
  };

  const isPredictDisabled =
    loading || !emailText.trim() || predicted; // disable button if loading, empty, or already predicted

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <nav className="navbar">
          <h1>EMAIL SPAM DETECTOR</h1>
        </nav>

        <div className="input-card">
          <p className="prompt">
            Enter message below and click "Predict" to check if it is Spam or Not.
          </p>

          <textarea
            className="email-input"
            value={emailText}
            onChange={handleChange}
            rows="6"
            placeholder="Type or paste your email here..."
            disabled={loading}
            autoFocus
          />

          <button
            className="predict-btn"
            onClick={handlePredict}
            disabled={isPredictDisabled}
          >
            {loading ? "Predicting..." : "Predict"}
          </button>

          {loading && <div className="loader"></div>}

          {prediction && (
            <div className={`prediction ${predType}`}>{prediction}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
