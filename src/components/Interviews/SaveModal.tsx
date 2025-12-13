import React from 'react';

interface SavedModelProps {
  saveAnswer: () => void;
  setSaveModalOpen: (isOpen: boolean) => void;
  saving?: boolean;
}

export const SavedModel: React.FC<SavedModelProps> = ({ 
  saveAnswer, 
  setSaveModalOpen, 
  saving = false 
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
        <h3 className="text-lg font-semibold mb-3">Save answer?</h3>
        <p className="text-sm text-gray-600 mb-4">
          This action will save your answer and the AI feedback. <br />
          <strong>You won't be able to re-answer this question later.</strong>
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setSaveModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={saveAnswer}
            disabled={saving}
            className={`px-4 py-2 rounded-lg transition ${
              saving
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
            }`}
          >
            {saving ? "Saving..." : "Confirm Save"}
          </button>
        </div>
      </div>
    </div>
  );
};