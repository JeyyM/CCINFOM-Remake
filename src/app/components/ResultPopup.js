import { useEffect } from 'react';

export default function ResultPopup({ selectedItem, onClose }) {
  if (!selectedItem) return null;

  return (
    <>
      <div className='whitesheet' onClick={onClose}></div>

      <div className='result-popup'>
        <h2>Details</h2>
        {Object.entries(selectedItem).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {value}
          </div>
        ))}
        <button onClick={onClose}>Close</button>
      </div>
    </>
  );
}
