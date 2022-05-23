import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Thumbnails from './Thumbnails';
import productStylesData from './example_data/productStylesData';

export default function ImageGallery({ changeImgView }) {
  const [currImgIdx, setCurrImgIdx] = useState(0);

  const incrementIdx = () => {
    setCurrImgIdx((prev) => prev + 1);
  };

  const decrementIdx = () => {
    setCurrImgIdx((prev) => prev - 1);
  };

  return (
    <section
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Thumbnails
        photos={productStylesData.results[0].photos}
        currImgIdx={currImgIdx}
        setCurrImgIdx={setCurrImgIdx}
      />
      <div
        style={{
          position: 'relative',
          height: '500px',
          width: '500px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img
          src={productStylesData.results[0].photos[currImgIdx].url}
          alt="sample img"
          style={{
            maxHeight: '500px',
            maxWidth: '390px',
          }}
        />
        <button
          type="button"
          onClick={changeImgView}
          style={{
            position: 'absolute',
            top: '1em',
            right: '1em',
          }}
        >
          Expanded View
        </button>
        {currImgIdx !== 0 && (
          <button
            type="button"
            onClick={decrementIdx}
            style={{
              position: 'absolute',
              top: '50%',
              left: '1em',
            }}
          >
            Prev
          </button>
        )}
        {currImgIdx !== productStylesData.results[0].photos.length - 1 && (
          <button
            type="button"
            onClick={incrementIdx}
            style={{
              position: 'absolute',
              top: '50%',
              right: '1em',
            }}
          >
            Next
          </button>
        )}
      </div>
    </section>
  );
}

ImageGallery.propTypes = {
  changeImgView: PropTypes.func.isRequired,
};
