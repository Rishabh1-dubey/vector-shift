// submit.js

import { useStore } from './store';
import { useState } from 'react';

export const SubmitButton = () => {
  const submitPipeline = useStore(state => state.submitPipeline);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitPipeline();
      if (result.success) {
        alert(
          `Pipeline Analysis Results:\n\n` +
          `Number of Nodes: ${result.data.num_nodes}\n` +
          `Number of Edges: ${result.data.num_edges}\n` +
          `Is DAG: ${result.data.is_dag ? 'Yes' : 'No'}`
        );
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit pipeline. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 border-t border-gray-800">
      <button
        className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        <span>{isSubmitting ? 'Submitting...' : 'Submit Pipeline'}</span>
      </button>
    </div>
  );
};
