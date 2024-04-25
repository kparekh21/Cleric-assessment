import React, { useState } from 'react';
import { Button, Form, FormGroup, Input, Label, Container, Row, Col, Spinner } from 'reactstrap';
import "../styles/InputOutputScreen.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function InputScreen() {
  const [question, setQuestion] = useState('');
  const [urls, setUrls] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [urlErrors, setUrlErrors] = useState(Array(urls.length).fill(''));

  const navigate = useNavigate();

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const isValidUrl = (url) => {
    return /^https?:\/\/.*/i.test(url);
  };
  
  const handleUrlChange = (index, event) => {
    const newUrls = urls.map((url, i) => {
      if (index === i) {
        return event.target.value;
      }
      return url;
    });
    setUrls(newUrls);
  
    const newErrors = urlErrors.slice();
    newErrors[index] = isValidUrl(event.target.value) ? '' : 'URL must start with http:// or https://';
    setUrlErrors(newErrors);
  };

  const addUrlField = () => {
    setUrls([...urls, '']);
    setUrlErrors([...urlErrors, '']);  // Add new error state
  };
  
  const removeUrlField = (index) => {
    const updatedUrls = urls.filter((_, i) => i !== index);
    const updatedErrors = urlErrors.filter((_, i) => i !== index);
    setUrls(updatedUrls);
    setUrlErrors(updatedErrors);
  };

  const fetchAndProcessData = async (inputData) => {
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/submit_question_and_documents`, inputData);
      navigate('/output');
    } catch (error) {
      console.error('Error processing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const areAllUrlsValid = urls.every((url, index) => isValidUrl(url));
  
    if (!areAllUrlsValid) {
      const newErrors = urls.map(url => isValidUrl(url) ? '' : 'URL must start with http:// or https://');
      setUrlErrors(newErrors);
      return;
    }
  
    fetchAndProcessData({
      question: question,
      documents: urls.filter(url => url.trim() !== '')
    });
  };

  if (loading) {
    return (
      <Container className="loading-container loading-overlay">
        <Spinner style={{ width: '10rem', height: '10rem' , color: 'white'}} />
      </Container>
    );
  }

  return (
    <Container className="inputScreen">
      <div class="d-flex justify-content-center">
      <h2>Cleric AI Engineer Assignment V2</h2>
      </div>
      <Form onSubmit={handleSubmit}>
        <FormGroup className="inputField">
          <Label for="questionInput">Question</Label>
          <Input
            type="text"
            name="question"
            id="questionInput"
            placeholder="Enter your question"
            value={question}
            onChange={handleQuestionChange}
          />
        </FormGroup>
        <Label for={`urlInput`}>Log URLs (Click "+" or "-" to Add or Remove more URLs)</Label>
        {urls.map((url, index) => (
  <FormGroup key={index} className="urlField">
    <Row>
      <Col xs="10">
        <Input
          type="url"
          name={`url${index}`}
          id={`urlInput${index}`}
          placeholder="Enter URL"
          value={url}
          onChange={(e) => handleUrlChange(index, e)}
          invalid={urlErrors[index] ? true : false}
        />
        {urlErrors[index] && <div className="text-danger">{urlErrors[index]}</div>}
      </Col>
      <Col xs="2">
        <Button onClick={() => addUrlField()} className="addButton">
          +
        </Button>
        {index !== 0 && (
          <Button onClick={() => removeUrlField(index)} className="removeButton">
            -
          </Button>
        )}
      </Col>
    </Row>
  </FormGroup>
))}
        <Button type="submit" className="submitButton">Submit</Button>
      </Form>
    </Container>
  );
}

export default InputScreen;
