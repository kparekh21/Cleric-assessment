This Python Flask and React application is designed to process and summarize documents in relation to a specific question. It integrates with the OpenAI API to utilize its advanced natural language processing capabilities, specifically leveraging the GPT-4 model. The application serves two main endpoints to interact with the frontend or other services: one for submitting questions and documents, and another for retrieving the processed facts.

-**React Frontend link**: http://ec2-3-17-223-124.us-east-2.compute.amazonaws.com:3000
-**Flask backend link**: http://ec2-3-17-223-124.us-east-2.compute.amazonaws.com:8080

## Approaches
### Approach 1: Keyword-Based Updating (Used)
This approach involves processing documents first for summary and then seperately removing keywords from the text and checking for duplicates. If the same keywords are found in subsequent entries, the related facts are updated; otherwise, new facts are appended. This method focuses on maintaining a concise and relevant set of data by avoiding redundancy.

### Approach 2: Cumulative Log Processing
In this approach, documents are processed in sequence—starting with the first log, then processing the first and second logs together, and so on. This method ensures that each document's context is built incrementally, which can enhance the accuracy and completeness of the information extracted from the logs. But very cost expensive.
 

## Key Components

- **Flask**: A lightweight WSGI web application framework. It is used to create the web server that handles API requests.
- **Pydantic**: Used for data validation and settings management using Python type annotations.
- **OpenAI API**: Used for processing the text and extracting facts relevant to the provided question. The interaction with this API is a crucial part of the document summarization process.
- **dotenv**: Manages environment variables from a `.env` file where sensitive information like the OpenAI API key is stored securely.
- **requests**: Handles HTTP requests to fetch documents from provided URLs.

## Endpoints

1. **POST `/submit_question_and_documents`**:
   - Accepts a JSON payload containing a `question` and a list of `documents` URLs.
   - Processes each document to extract relevant facts using the OpenAI API.
   - Updates the internal data store with facts, taking into account any similarities or updates needed based on previously stored facts.

2. **GET `/get_question_and_facts`**:
   - Returns the current question, the extracted facts, and the processing status.

## Processing Workflow

1. **Document Processing**:
   - For each document URL provided, the document is fetched, and its content is processed to extract relevant information as bullet points based on the specified question.
   - The extracted facts are then compared against existing facts to determine updates or removals necessary to maintain accuracy and relevance.

2. **Fact Management**:
   - New facts are integrated with existing ones, updating or deleting based on a comparison to ensure the final list reflects the most current and accurate information.
