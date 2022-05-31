import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Carousel({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const updateIndex = (newIndex) => {
    let updatedIndex = newIndex;
    if (updatedIndex < 0) {
      updatedIndex = React.Children.count(children) - 1;
    } else if (newIndex >= React.Children.count(children) - 2) {
      updatedIndex = 0;
    }

    setActiveIndex(updatedIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        updateIndex(activeIndex + 1);
      }
    }, 5000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  return (
    <div className="carousel">
      <div
        className="inner"
        style={{
          transform: `translateX(-${activeIndex * 260}px)`,
          whiteSpace: 'nowrap',
          transition: 'transform 0.5s',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {React.Children.map(children, (child) => React.cloneElement(child))}
      </div>
      <div
        className="indicators"
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '5px',
        }}
      >
        <button
          type="button"
          style={{
            margin: '5px',
          }}
          onClick={() => {
            updateIndex(activeIndex - 1);
          }}
        >
          Prev
        </button>
        <button
          type="button"
          style={{
            margin: '5px',
          }}
          onClick={() => {
            updateIndex(activeIndex + 1);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

Carousel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};