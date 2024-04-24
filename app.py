from flask import Flask, request, jsonify
from pydantic import BaseModel
from typing import List, Optional
import openai
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv('OPENAI_API_KEY')
MODEL_GPT = "gpt-3.5-turbo"

class GetQuestionAndFactsResponse(BaseModel):
    question: str
    facts: Optional[List[str]]
    status: str

current_data = {
    "question": None,
    "facts": [],
    "status": "processing"
}

def process_document(content, question):
    """Send document content for processing using Chat API."""
    try:
        response = openai.ChatCompletion.create(
            model=MODEL_GPT,
            messages=[
                {"role": "system", "content": "You are a helpful summarizing text in one liners assistant. Your task is to summarize key facts from call logs relevant to specific questions."},
                {"role": "user", "content": f"Question:{question}Call Log Input:{content}Instructions for Processing:1. **Read the Call Log**: Thoroughly review the text from the call log to grasp the context and the points discussed.2. **Identify Relevant Information**: Pinpoint statements or decisions that answer the question provided, focusing on capturing key decisions, agreements, and action plans mentioned during the call.3. **List Facts as One-liners**: Summarize the extracted information into concise, one-line facts. Each fact should be standalone and clear.4. **Ensure Clarity and Relevance**: Ensure each fact directly relates to the question and provides a clear answer or information about it. Exclude extraneous details and names unless they are crucial per the question.### Expected Output:- Provide a list of facts formatted as bullet points. Each bullet point should directly answer the question based on the discussion in the call log. Ensure the facts are only in bullet points without additional explanation.Names of people are not important unless stated in question"},
            ]
        )
        return response['choices'][0]['message']['content'].strip().split('\n')
    except Exception as e:
        return [f"Error processing document: {str(e)}"]

def similarity_for_update_remove(prev_facts, new_facts):
    """Send facts for similarity checking and keep only relevant data in facts."""
    try:
        response = openai.ChatCompletion.create(
            model=MODEL_GPT,
            messages=[
                {"role": "system", "content": "You are a helpful assistant tasked with comparing previous and new facts and deleting, updating or just adding based on getting context."},
                {"role": "user", "content": f"Previous facts:{prev_facts}\nNew facts:{new_facts}\nUpdate different points of previous facts with new facts by replacing or deleting entries based on contradictions, modifications, or negations. Inputs include a list of previous facts and a new list of facts. Process involves comparing each new fact against previous facts to identify similarities and determine necessary updates: delete facts that are negated, and replace facts that are modified. Keep unchanged facts that are not contradicted. The output should be multiple updated facts points that reflects the current state after processing new information. For example if a certain decision has one value in previous fact and other key value in new fact, replace the previous fact with new fact. Similarly, if a certain fact in previous file is negated in new fact file delete the fact altogether.If it is an different fact altogether, just append it. Consider semantic similarity and efficiency in handling multiple impacts.  Dont give explanations. Expected output: just the bullet points"},
            ]
        )
        return response['choices'][0]['message']['content'].strip().split('\n')
    except Exception as e:
        return [f"Error updating facts: {str(e)}"]

@app.route('/submit_question_and_documents', methods=['POST'])
def submit_question_and_documents():

    data = request.json

    current_data['question'] = data['question']
    current_data['facts'] = []  # Start or Reset
    current_data['status'] = 'processing'

    document_errors = []

    for document_url in data['documents']:
        try:
            doc_response = requests.get(document_url, timeout=10)
            doc_response.raise_for_status() 
            doc_content = doc_response.text
            new_facts = process_document(doc_content, current_data['question'])
            current_data['facts'] = similarity_for_update_remove(current_data['facts'], new_facts)

        except requests.exceptions.RequestException as e:
            error_message = f"Error with document {document_url}: {str(e)}"
            document_errors.append(error_message)
            print("These are the errors found:",document_errors)

    current_data['status'] = 'done'
    print(current_data)
    return jsonify({}), 200

@app.route('/get_question_and_facts', methods=['GET'])
def get_question_and_facts():
    response_model = GetQuestionAndFactsResponse(
        question=current_data['question'],
        facts=current_data['facts'],
        status=current_data['status']
    )
    return jsonify(response_model.model_dump()), 200

if __name__ == '__main__':
    app.run(debug=True)
