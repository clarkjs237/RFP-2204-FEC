import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import AnswerPhotos from './AnswerPhotos';
import config from '../../../../config/config';

export default function AnswerList({ answer }) {
  const { body, date } = answer;
  const [marked, setMarked] = useState(false);
  const [helpful, setHelpful] = useState(answer.helpfulness);
  const [reportToggle, setReportToggle] = useState(false);

  const url = 'http://3.101.61.16:8080/';

  const markAnswerHelpful = () => {
    if (!marked) {
      axios
        .put(`${url}qa/answers/${answer.id}/helpful`, null, {
          headers: { Authorization: config.TOKEN },
        })
        .then(() => {
          setMarked(true);
          setHelpful(helpful + 1);
        });
    }
  };

  const reportAnswer = () => {
    if (!reportToggle) {
      axios
        .put(`${url}qa/answers/${answer.id}/report`, null, {
          headers: { Authorization: config.TOKEN },
        })
        .then(() => {
          setReportToggle(true);
        });
    }
  };

  return (
    <div className="answer-div">
      <div className="answer">
        <span
          style={{
            fontWeight: 'bold',
          }}
        >
          A: &nbsp;
        </span>
        {body}
      </div>
      <div className="photo">
        {answer.photos.length > 0 &&
          answer.photos.map((photo) => (
            <AnswerPhotos photo={photo} key={photo} />
          ))}
      </div>
      <div className="answer-name">
        <span>by &nbsp;</span>
        {answer.answerer_name.toLowerCase() === 'seller' ? (
          <span
            style={{
              fontWeight: 'bold',
            }}
          >
            Seller &nbsp;
          </span>
        ) : (
          <span>{answer.answerer_name}, &nbsp;</span>
        )}
        <span> {format(parseISO(date), 'MMMM, dd, yyyy')}</span>
        <span> &nbsp;&nbsp;|&nbsp; Helpful? &nbsp;&nbsp;</span>
        {marked === false && (
          <span
            onClick={markAnswerHelpful}
            onKeyPress={markAnswerHelpful}
            tabIndex="0"
            role="button"
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Yes
          </span>
        )}
        {marked === true && <span>Yes</span>}
        <span> &nbsp;&nbsp;({helpful}) &nbsp;&nbsp;|&nbsp;&nbsp;</span>
        {reportToggle === false && (
          <span
            onClick={reportAnswer}
            onKeyPress={reportAnswer}
            tabIndex="0"
            role="button"
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Report
          </span>
        )}
        {reportToggle === true && <span> Thank you for your report!</span>}
      </div>
    </div>
  );
}

AnswerList.propTypes = {
  answer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
