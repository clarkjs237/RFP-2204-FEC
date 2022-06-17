import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import axios from 'axios';
import PropTypes from 'prop-types';
import config from '../../../../config/config';

export default function AddAnswer({ question, setShowModal }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [answer, setAnswer] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [photos, setPhotos] = React.useState([]);
  const [photosUpload, setPhotosUpload] = React.useState([]);

  const url = config.PGHOST;

  const isValidEmail = (val) => {
    const validEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validEmail.test(val);
  };

  const handleSubmit = () => {
    const error = [];
    if (!answer.length) {
      error.push('Answer');
    }
    if (!nickname.length) {
      error.push('Nickname');
    }
    if (!isValidEmail(email)) {
      error.push('Valid Email');
    }
    if (photos.length !== photosUpload.length) {
      error.push('Valid Photo');
    }
    if (error.length) {
      setErrorMessage(
        `Please enter correct values in the following fields: ${error.join(
          ', '
        )}`
      );
    } else {
      axios
        .post(
          `${url}qa/questions/${question.question_id}/answers`,
          {
            body: answer,
            name: nickname,
            email,
            photos,
          },
          {
            headers: { Authorization: config.TOKEN },
          }
        )
        .then(() => {
          setShowModal(false);
        });
    }
  };

  const handleUpload = async (files) => {
    if (files.length < 6) {
      const images = [];
      const promises = [];
      for (let i = 0; i < files.length; i += 1) {
        const currentFile = files[i];
        const formData = new FormData();
        formData.append('file', currentFile);
        formData.append('upload_preset', 'fw2havd4');
        promises.push(
          axios
            .post(
              'https://api.cloudinary.com/v1_1/drzzqblqw/image/upload',
              formData
            )
            .then((res) => {
              images.push(res.data.url);
            })
        );
      }
      Promise.all(promises).then(() => setPhotos(images));
    } else {
      setErrorMessage('Please do NOT upload more than 5 photos');
    }
  };

  const handlePhotos = (e) => {
    setPhotosUpload(e.target.files);
    handleUpload(e.target.files);
  };

  return (
    <div className="answer-modal">
      <button
        className="answer-modal-close"
        type="button"
        onClick={() => setShowModal(false)}
      >
        X
      </button>
      <h2 style={{ textAlign: 'center' }}>
        Submit Your Answer: {question.question_body}
      </h2>
      {errorMessage && (
        <div
          style={{
            backgroundColor: 'pink',
            fontWeight: 'bold',
          }}
        >
          {errorMessage}
        </div>
      )}
      <form
        style={{
          display: 'flex',
          padding: '1em',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '20px',
        }}
      >
        <div
          style={{
            padding: '5px',
            height: '100px',
          }}
        >
          <label htmlFor="answer">
            Your Answer*: <br />
            <textarea
              type="text"
              id="answer"
              maxLength={1000}
              minLength={1}
              autoComplete="off"
              rows={4}
              columns={60}
              style={{
                width: '420px',
                height: '60px',
              }}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </label>
        </div>
        <div
          style={{
            padding: '5px',
            height: '70px',
          }}
        >
          <label htmlFor="nickname">
            Nickname*:{' '}
            <input
              id="nickname"
              maxLength={60}
              placeholder="Example: jack543!"
              onChange={(e) => setNickname(e.target.value)}
            />
          </label>
          <p
            style={{
              fontStyle: 'italic',
              fontSize: '14px',
            }}
          >
            For privacy reasons, do not use your full name or email address
          </p>
        </div>
        <div
          style={{
            padding: '5px',
            height: '70px',
          }}
        >
          <label htmlFor="email">
            Email*:{' '}
            <input
              type="email"
              id="email"
              maxLength={60}
              placeholder="jack@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <p
            style={{
              fontStyle: 'italic',
              fontSize: '14px',
            }}
          >
            For authentication reasons, you will not be emailed
          </p>
        </div>
        <div
          style={{
            padding: '5px',
            height: '150px',
          }}
        >
          <label htmlFor="multipleFiles">
            Upload Your Photos (Limit 5){' '}
            <input
              type="file"
              accept="image/*"
              id="multipleFiles"
              multiple
              onChange={handlePhotos}
            />
          </label>
          {photos.length > 0 && (
            <div>
              Preview:
              <br />
              {photos.map((photo) => (
                <img
                  style={{
                    padding: '5px',
                    height: '90px',
                  }}
                  src={photo}
                  key={nanoid()}
                  alt="preview"
                />
              ))}
            </div>
          )}
        </div>
        <button
          className="answer-form-submit-button"
          type="button"
          onClick={handleSubmit}
        >
          Submit Answer
        </button>
      </form>
    </div>
  );
}
AddAnswer.propTypes = {
  question: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  setShowModal: PropTypes.func.isRequired,
};
