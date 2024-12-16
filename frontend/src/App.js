import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Enter text to analyze');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await axios.post('http://localhost:8080/analyze', { text });
      setAnalysis(response.data);
    } catch (err) {
      setError('Error parsing text. Check your connection to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Text Analyzer</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <textarea 
          className="w-full h-40 border-2 border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze"
        />
        <button 
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300"
          onClick={handleAnalyze}
          disabled={isLoading}
        >
          {isLoading ? 'Analysis...' : 'Analyze'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {analysis && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Analysis results:</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Sentences</p>
                <p className="text-2xl">{analysis.sentenceCount}</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Text length</p>
                <p className="text-2xl">{analysis.totalLength}</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Words</p>
                <p className="text-2xl">{analysis.wordCount}</p>
              </div>
            </div>
            
            <h3 className="mt-4 font-bold text-lg mb-2">List of sentences:</h3>
            <ul className="space-y-2">
              {analysis.sentences.map((sentence, index) => (
                <li 
                  key={index} 
                  className="bg-white p-3 rounded shadow-sm"
                >
                  {sentence}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;