import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { nanoid } from 'nanoid';
import CharacteristicsButtons from './CharacteristicsButtons';
import ClickStars from './ClickStars';
import config from '../../../config/config';

require("dotenv").config();

function ReviewModal({ meta, productID, setReviews, toggleModal }) {
  const [wordCount, updateWordCount] = useState(0);

  const [formRating, changeFormRating] = useState(null);
  const [formRecommend, changeFormRecommend] = useState('');
  const [formSummary, changeFormSummary] = useState('');
  const [formBody, changeFormBody] = useState('');
  const [formName, changeFormName] = useState('');
  const [formEmail, changeFormEmail] = useState('');
  const [formImages, changeFormImages] = useState([]);
  const [radioQualities, setRadioQualities] = useState({});

  const metaEntries = Object.entries(meta.characteristics);

  // ------------------------------------------------------
  //                  Working Version
  // ------------------------------------------------------
  // const url = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/';
  // const id = productID;
  // ------------------------------------------------------
  //                     Sully Version
  // ------------------------------------------------------
 // const url = 'http://54.184.164.212:3000/';
  const url = process.env.HOSTSERVER + process.env.HOSTPORT;
  // ------------------------------------------------------

  const uploadImages = (event) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', event.target.files[0]);
    bodyFormData.append('upload_preset', 'vypkehti');
    axios
      .post(
        'https://api.cloudinary.com/v1_1/dppbuevux/image/upload',
        bodyFormData
      )
      .then((response) => changeFormImages([...formImages, response.data.url]));
  };

  const handleRadioChange = (id, newRating) => {
    const idString = id.toString();
    setRadioQualities((prev) => ({
      ...prev,
      [idString]: newRating,
    }));
  };

  const changeWordCount = (text) => {
    updateWordCount(text.length);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let recommended = false;
    if (formRecommend === 'yes') {
      recommended = true;
    }
    const testRadio = { ...radioQualities };
    const newPost = {
      product_id: productID,
      rating: formRating,
      recommend: recommended,
      summary: formSummary,
      body: formBody,
      name: formName,
      email: formEmail,
      photos: formImages,
      characteristics: testRadio,
    };

    axios
      .post(
        `${url}reviews`,
        newPost,
        {
          headers: { Authorization: config.TOKEN },
        }
      )
      .then(() => {
        toggleModal();
      })
      .then(() => {
        axios
          .get(
            `${url}reviews/?product_id=${productID}&sort=newest&count=1000`,
            {
              headers: { Authorization: config.TOKEN },
            }
          )
          .then((results) => setReviews(results.data.results));
      });
  };

  return (
    <div className="full-modal-container">
      <div
        className="modal-overlay"
        onClick={toggleModal}
        role="button"
        tabIndex={0}
        onKeyDown={() => toggleModal()}
        aria-label="close modal with overlay"
        style={{
          zIndex: '5000',
        }}
      />
      <div
        className="outline-color"
        style={{
          backgroundColor: 'var(--verde-theme)',
          position: 'absolute',
          padding: '2rem',
          alignSelf: 'center',
          zIndex: '9999',
        }}
      >
        <form
          className="reviewModal-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: '5rem',
            padding: '0.5rem',
            justifyContent: 'center',
            alignItems: 'center',
            accentColor: 'aquamarine',
            fontSize: '1.1em',
          }}
          onSubmit={handleSubmit}
        >
          <h4 className="review-modal-header">
            Please give us some feedback on your product
          </h4>
          <p className="rating-modal-title">RATING</p>
          <ClickStars changeFormRating={changeFormRating} />
          <div className="rating-definition">
            <p className="number-definition">1 - POOR</p>
            <p className="number-definition">2 - FAIR</p>
            <p className="number-definition">3 - AVERAGE</p>
            <p className="number-definition">4 - GOOD</p>
            <p className="number-definition">5 - GREAT</p>
          </div>
          <div
            className="do-you-recommend"
            style={{
              padding: 0,
            }}
          >
            <p
              style={{
                fontWeight: '500',
                textAlign: 'center',
                marginBottom: '0.2rem',
              }}
            >
              Do you recommend this product?
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                margin: 0,
              }}
            >
              <label htmlFor="yes">
                <p className="yes-no-labels">
                  Yes
                  <input
                    type="radio"
                    value="yes"
                    name="recommend-btn"
                    className="recommendation-radio-btns"
                    checked={formRecommend === 'yes'}
                    onChange={(event) =>
                      changeFormRecommend(event.target.value)
                    }
                  />
                </p>
              </label>
              <label htmlFor="no">
                <p className="yes-no-labels">
                  No
                  <input
                    type="radio"
                    value="no"
                    name="recommend-btn"
                    className="recommendation-radio-btns"
                    checked={formRecommend === 'no'}
                    onChange={(event) =>
                      changeFormRecommend(event.target.value)
                    }
                  />
                </p>
              </label>
            </div>
          </div>
          <div className="characteristics-radio-btns">
            {metaEntries.map((entry) => (
              <CharacteristicsButtons
                characteristic={entry[0]}
                id={entry[1].id}
                key={entry[1].id}
                handleRadioChange={handleRadioChange}
              />
            ))}
          </div>
          <label htmlFor="body" style={{ padding: '2rem' }}>
            Summary
            <input
              type="text"
              name="review-summary"
              id="Review Summary"
              placeholder="Example: Best purchase ever!"
              className="review-summary-form"
              maxLength="60"
              onChange={(event) => {
                changeFormSummary(event.target.value);
              }}
            />
          </label>
          <label htmlFor="body">
            Body
            <input
              type="text"
              name="review-body"
              id="Review Body"
              placeholder="Why did you like the product or not?"
              className="review-body-form"
              minLength="50"
              maxLength="1000"
              onChange={(event) => {
                changeFormBody(event.target.value);
                changeWordCount(event.target.value);
              }}
            />
          </label>
          {wordCount < 50 && (
            <p
              style={{
                fontSize: '0.7em',
              }}
            >
              <i>Minimum required characters left:{50 - wordCount}</i>
            </p>
          )}
          {wordCount >= 50 && <p>Character requirement achieved!</p>}
          <section
            htmlFor="upload-photos"
            style={{
              fontSize: '1.5em',
              margin: '4rem',
              border: 'solid lightgray 0.1em',
              padding: '2.5rem 5rem',
              maxWidth: '65rem',
              textAlign: 'center',
              boxShadow: '0 0 2.5rem lightgray',
            }}
          >
            Upload photos
            <br />
            <label htmlFor="upload-img-btn" className="alt-review-button">
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={uploadImages}
                className="review-button"
                id="upload-img-btn"
                style={{
                  display: 'none',
                  padding: '0rem',
                  fontSize: '0.5em',
                  fontFamily: 'montserrat',
                }}
              />
            </label>
            {/* <input
              type="file"
              accept="image/*"
              onChange={uploadImages}
              className="review-button"
              style={{
                padding: '0rem',
                fontSize: '0.5em',
                fontFamily: 'montserrat',
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={uploadImages}
              className="review-button"
              style={{
                padding: '0rem',
                fontSize: '0.5em',
                fontFamily: 'montserrat',
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={uploadImages}
              className="review-button"
              style={{
                padding: '0rem',
                fontSize: '0.5em',
                fontFamily: 'montserrat',
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={uploadImages}
              className="review-button"
              style={{
                padding: '0rem',
                fontSize: '0.5em',
                fontFamily: 'montserrat',
              }}
            /> */}
            {formImages.map((image) => (
              <img
                src={image}
                alt="upload"
                key={nanoid()}
                className="upload-review-thumbnails"
              />
            ))}
          </section>
          <label htmlFor="nickname" style={{ padding: '1rem 0rem' }}>
            Nickname
            <input
              type="text"
              name="nickname"
              placeholder="Example:jackson11"
              className="name-email-input"
              maxLength="60"
              onChange={(event) => {
                changeFormName(event.target.value);
              }}
            />
          </label>
          <p className="disclaimer-text">
            For privacy reasons, do <i>not</i> use your full name or email
            address.
          </p>
          <label htmlFor="email" style={{ padding: '1rem 0rem' }}>
            Email
            <input
              type="email"
              name="email"
              placeholder="Example:jackson11@email.com"
              className="name-email-input"
              maxLength="60"
              onChange={(event) => {
                changeFormEmail(event.target.value);
              }}
            />
          </label>
          <p
            className="disclaimer-text"
            style={{
              marginBottom: '2rem',
            }}
          >
            For authentication reasons, you <i>will not</i> be emailed.
          </p>
          <button type="submit" className="alt-review-button hover-pointer">
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
}

ReviewModal.propTypes = {
  meta: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  productID: PropTypes.number.isRequired,
  setReviews: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default ReviewModal;
