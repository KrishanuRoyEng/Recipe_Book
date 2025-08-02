import { useEffect, useState } from 'react';
import './Styles/TagSelector.css';

export default function TagSelector({ selectedTags = [], onChange }) {
  const [tags, setTags] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/tags')
      .then(res => res.json())
      .then(setTags)
      .catch(() => setTags([]));
  }, []);

  const toggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(t => t !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className="tag-selector">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="add-tag-btn"
      >
        + Add Tags
      </button>
      {isOpen && (
        <div className="tag-popup">
          {tags.map((tag) => (
            <div
              key={tag._id}
              className="tag-option"
              style={{ backgroundColor: tag.color || "#444", color: "#fff" }}
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(tag._id)}
                onChange={() => toggleTag(tag._id)}
              />
              <label>{tag.name}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

