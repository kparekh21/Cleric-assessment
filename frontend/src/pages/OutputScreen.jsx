import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/InputOutputScreen.css";

const OutputScreen = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get_question_and_facts`);
        setData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="outputScreen">
      <h2>{data.question}</h2>
        <ul className="fact-list">
          {data.facts.map((fact, index) => (
            <li key={index} className="fact-item">{fact}</li>
          ))}
        </ul>
    </div>
    );
  };

export default OutputScreen;


