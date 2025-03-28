import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const API_SOURCES = {
  p: "http://20.244.56.144/test/primes",
  f: "http://20.244.56.144/test/fibo",
  e: "http://20.244.56.144/test/even",
  r: "http://20.244.56.144/test/rand"
};

// API Credentials
const AUTH_URL = "http://20.244.56.144/test/auth";
const AUTH_BODY = {
  companyName: "AffordMed",
  clientID: "0a2affd7-8add-4e46-b6af-3978b9391a92",
  clientSecret: "qELGVdYRfGONReGg",
  ownerName: "Aiswarya Alluri",
  ownerEmail: "aiswaryaalluri32@gmail.com",
  rollNo: "22761A1270"
};

const App = () => {
  const { category } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");

  const fetchApiKey = async () => {
    try {
      const response = await axios.post(AUTH_URL, AUTH_BODY);
      return response.data?.access_token || "";
    } catch (err) {
      console.error("Error fetching API key:", err);
      throw new Error("Failed to get API key");
    }
  };

  const fetchData = async (key) => {
    if (!category || !API_SOURCES[category]) {
      setError("Invalid category. Use /p, /f, /e, or /r.");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await axios.get(API_SOURCES[category], {
        headers: { Authorization: `Bearer ${key}` },
        timeout: 3000
      });

      setData(response.data.numbers || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Check API key or network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchKeyAndData = async () => {
      try {
        const key = await fetchApiKey();
        setApiKey(key);
        fetchData(key);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchKeyAndData();
  }, [category]);

  return (
    <div className="container">
      <h1>22761A1270 Calculator</h1>
      <h2>Category: {category?.toUpperCase()}</h2>

      {loading && <div className="loader"></div>}
      {error && <p className="error">{error}</p>}

      {data && !loading && !error && (
        <div className="data-box">
          <h3>Numbers</h3>
          <p>{data.length > 0 ? data.join(", ") : "No data available"}</p>
          {data.length > 0 && (
            <h3>Average: {(data.reduce((a, b) => a + b, 0) / data.length).toFixed(2)}</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default App;