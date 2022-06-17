import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import config from '../../../../config/config';

export default function AddAQuestion({ productID, setOpenModal }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [question, setQuestion] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  const url = 'http://3.101.61.16:8080/';

  const isValidEmail = (val) => {
    const validEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validEmail.test(val);
  };

  const handleSubmit = () => {
    const error = [];
    if (!question.length) {
      error.push('Question');
    }
    if (!nickname.length) {
      error.push('Nickname');
    }
    if (!isValidEmail(email)) {
      error.push('Valid Email');
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
          `${url}qa/questions`,
          {
            product_id: productID,
            body: question,
            name: nickname,
            email,
          },
          {
            headers: { Authorization: config.TOKEN },
          }
        )
        .then(() => {
          setOpenModal(false);
        });
    }
  };

  return (
    <div className="add-question-modal">
      <button
        className="add-question-modal-close"
        type="button"
        onClick={() => setOpenModal(false)}
      >
        X
      </button>
      <h2 style={{ textAlign: 'center' }}>
        New Question About: product #{productID}
      </h2>
      {errorMessage && (
        <div
          style={{
            backgroundColor: 'pink',
            fontWeight: 'bold',
            padding: '5px',
          }}
        >
          {errorMessage}
        </div>
      )}
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px',
          fontSize: '18px',
        }}
      >
        <div
          style={{
            padding: '5px',
            height: '100px',
            width: '150px',
          }}
        >
          <label htmlFor="question">
            Your Question*:
            <br />
            <textarea
              type="text"
              id="question"
              maxLength={1000}
              minLength={1}
              autoComplete="off"
              rows={4}
              columns={60}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </label>
        </div>
        <div
          style={{
            padding: '5px',
          }}
        >
          <label htmlFor="nickname">
            Nickname*:{' '}
            <input
              id="nickname"
              maxLength={60}
              placeholder="Example: jack123!"
              onChange={(e) => setNickname(e.target.value)}
            />
          </label>
        </div>
        <p
          style={{
            fontStyle: 'italic',
            fontSize: '14px',
            padding: '5px',
          }}
        >
          For privacy reasons, do not use your full name or email address
        </p>
        <div
          style={{
            padding: '5px',
          }}
        >
          <label htmlFor="email">
            Email*:{' '}
            <input
              type="email"
              id="email"
              maxLength={60}
              placeholder="jack123@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <p
          style={{
            fontStyle: 'italic',
            fontSize: '14px',
            padding: '5px',
          }}
        >
          For authentication reasons, you will not be emailed
        </p>{' '}
        <button
          className="question-form-submit-button"
          type="button"
          onClick={handleSubmit}
        >
          Submit Question
        </button>
      </form>
    </div>
  );
}
AddAQuestion.propTypes = {
  productID: PropTypes.number.isRequired,
  setOpenModal: PropTypes.func.isRequired,
};
