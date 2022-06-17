import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import axios from 'axios';
import PropTypes from 'prop-types';
import AnswerList from './AnswerList';
import MoreAnswers from './MoreAnswers';
import AddAnswer from './AddAnswer';
import SearchHighlight from './SearchHighlight';
import config from '../../../../config/config';

export default function Question({ question, searchInput }) {
  const [marked, setMarked] = useState(false);
  const [helpful, setHelpful] = useState(question.question_helpfulness);
  const [showModal, setShowModal] = useState(false);

  const url = 'http://3.101.61.16:8080/';

  let answerArr = Object.keys(question.answers).map((a) => question.answers[a]);
  const sellerCompare = (a, b) => {
    if (a.answerer_name === 'Seller' && b.answerer_name !== 'Seller') {
      return -1;
    }
    if (a.answerer_name !== 'Seller' && b.answerer_name === 'Seller') {
      return 1;
    }
    return 0;
  };

  answerArr = answerArr
    .sort((a, b) => b.helpfulness - a.helpfulness)
    .sort(sellerCompare);

  const markHelpful = () => {
    if (!marked) {
      axios
        .put(`${url}qa/questions/${question.question_id}/helpful`, null, {
          headers: { Authorization: config.TOKEN },
        })
        .then(() => {
          setMarked(true);
          setHelpful(helpful + 1);
        });
    }
  };

  return (
    <div className="question">
      <div className="question-body">
        Q:{' '}
        {searchInput !== null ? (
          <SearchHighlight
            searchInput={searchInput}
            body={question.question_body}
          />
        ) : (
          question.question_body
        )}
        <div className="question-control">
          Helpful?&nbsp;&nbsp;
          {marked === false && (
            <span
              onClick={markHelpful}
              onKeyPress={markHelpful}
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
          <span> &nbsp;({helpful}) &nbsp;&nbsp;| &nbsp;&nbsp;</span>
          <span
            onClick={() => setShowModal(true)}
            onKeyPress={setShowModal}
            tabIndex="0"
            role="button"
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Add Answer
          </span>
        </div>
      </div>
      {answerArr
        .slice(0, 3)
        .map((answer, count) =>
          count > 1 ? (
            <MoreAnswers answerArr={answerArr} key={nanoid()} />
          ) : (
            <AnswerList key={nanoid()} answer={answer} />
          )
        )}
      {showModal && (
        <AddAnswer question={question} setShowModal={setShowModal} />
      )}
    </div>
  );
}

Question.propTypes = {
  question: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  searchInput: PropTypes.string,
};

Question.defaultProps = {
  searchInput: null,
};
