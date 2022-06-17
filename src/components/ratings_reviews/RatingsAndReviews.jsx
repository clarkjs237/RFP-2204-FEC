import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPen } from '@fortawesome/free-solid-svg-icons';
import Ratings from './Ratings';
import Reviews from './Reviews';
import ReviewModal from './ReviewModal';
import config from '../../../config/config';

function RatingsAndReviews({ productID }) {
  const [modalActive, setModalStatus] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [visible, setVisible] = useState(2);
  const [ratingSwitch, toggleRatingSwitch] = useState({});
  const [meta, setMeta] = useState({
    characteristics: {
      Comfort: {
        id: 0,
        value: '',
      },
      Fit: {
        id: 0,
        value: '',
      },
      Length: {
        id: 0,
        value: '',
      },
      Quality: {
        id: 0,
        value: '',
      },
    },
    ratings: { 1: '', 2: '', 3: '', 4: '', 5: '' },
    recommended: { false: '', true: '' },
  });

  // ------------------------------------------------------
  //                  Working Version
  // ------------------------------------------------------
  // const url = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/';
  // const id = productID;
  // ------------------------------------------------------
  //                     Sully Version
  // ------------------------------------------------------
  const url = 'http://localhost:8080/';
  const id = 1000011;
  productID = id; // need to reset what productID is
  // ------------------------------------------------------

  useEffect(() => {
    axios
      .get(`${url}reviews/?product_id=${id}&sort=newest&count=1000`, {
        headers: { Authorization: config.TOKEN },
      })
      .then((results) => setReviews(results.data.results));
    axios
      .get(`${url}reviews/meta/?product_id=${id}`, {
        headers: { Authorization: config.TOKEN },
      })
      .then((results) => setMeta({ ...results.data }));
  }, [id]);


  const toggleRatedReviews = (rating) => {
    const copy = { ...ratingSwitch };
    if (copy[rating]) {
      delete copy[rating];
    } else {
      copy[rating] = rating;
    }
    toggleRatingSwitch(copy);
  };

  const ratedReviews = useMemo(() => {
    const filtered = Object.values(ratingSwitch);
    const result = [];
    for (let i = 0; i < filtered.length; i += 1) {
      for (let j = 0; j < reviews.length; j += 1) {
        if (reviews[j].rating === filtered[i]) {
          result.push(reviews[j]);
        }
      }
    }
    return result;
  }, [ratingSwitch, reviews]);

  const toggleModal = () => {
    setModalStatus(!modalActive);
  };

  const addVisibility = () => {
    const newTotal = visible + 2;
    setVisible(newTotal);
  };

  // created a new variable newTotal to prevent linter errors with constants/

  if (modalActive) {
    document.body.classList.add('prevent-scroll-background');
  } else {
    document.body.classList.remove('prevent-scroll-background');
  }

  const sortReviews = (sortType) => {
    axios
      .get(
        `${url}reviews/?product_id=${id}&count=1000&sort=${sortType.toLowerCase()}`,
        {
          headers: { Authorization: config.TOKEN },
        }
      )
      .then((results) => setReviews(results.data.results));
  };

  const submitHelpfulNess = (value, reviewId) => {
    if (value === 'yes') {
      axios.put(`${url}reviews/${reviewId}/helpful`, null, {
        headers: { Authorization: config.TOKEN },
      });
    }
  };

  return (
    <>
      <h2 className="ri-header fade-in">Ratings & Reviews</h2>
      <section
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          fontFamily: 'Cormorant Garamond',
          fontWeight: '100',
          fontSize: '24px',
          padding: '0.2em',
          flexWrap: 'wrap',
          overflowX: 'hidden',
        }}
        id="ratings-reviews"
      >
        <Ratings
          meta={meta}
          ratingSwitch={ratingSwitch}
          toggleRatedReviews={toggleRatedReviews}
        />
        <Reviews
          reviews={ratedReviews.length === 0 ? reviews : ratedReviews}
          toggleModal={toggleModal}
          visible={visible}
          addVisibility={addVisibility}
          sortReviews={sortReviews}
          submitHelpfulNess={submitHelpfulNess}
        />
        {modalActive && (
          <ReviewModal
            meta={meta}
            toggleModal={toggleModal}
            setReviews={setReviews}
            productID={productID}
          />
        )}
        <section
          className="button-container"
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignSelf: 'end',
            width: '50%',
            right: '80%',
            marginLeft: 'auto',
            marginBottom: '1em',
            marginTop: '1em',
          }}
        >
          <button
            type="button"
            className="alt-review-button hover-pointer"
            onClick={toggleModal}
          >
            <FontAwesomeIcon
              icon={faPen}
              size="xs"
              style={{
                opacity: '1',
                margin: '0em 0.5em',
              }}
            />
            WRITE A NEW REVIEW
          </button>
          {visible < reviews.length && (
            <button
              type="button"
              className="alt-review-button hover-pointer"
              onClick={addVisibility}
            >
              <FontAwesomeIcon
                icon={faCirclePlus}
                size="xs"
                style={{
                  opacity: '1',
                  margin: '0em 0.5em',
                }}
              />
              SHOW MORE
            </button>
          )}
        </section>
      </section>
    </>
  );
}

RatingsAndReviews.propTypes = {
  productID: PropTypes.number.isRequired,
};

export default RatingsAndReviews;
