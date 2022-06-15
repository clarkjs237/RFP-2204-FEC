import axios from 'axios';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Carousel from './Carousel';
import ProductCard from './RIProductCard';

import config from '../../../config/config';
import Compare from './Compare/CompareModal';

export default function RelatedItems({ curProd, setCurProd }) {
  const [relatedItemIDs, setRelatedItemIDs] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [compProd, setCompProd] = useState({});

  const url = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/';
  useEffect(() => {
    axios
      .get(`products/${curProd.id}/related`, {
        headers: { Authorization: config.TOKEN },
      })
      .then((results) =>
        setRelatedItemIDs(
          [...new Set(results.data)].filter((prodID) => prodID !== curProd.id)
        )
      );
  }, [curProd]);

  return (
    <div className="related-items">
      <h2 className="ri-header fade-in">Related Items</h2>
      <Carousel>
        {relatedItemIDs.map((productID) => (
          <ProductCard
            curProd={curProd}
            productID={productID}
            key={productID}
            setOpenModal={setOpenModal}
            setCompProd={setCompProd}
            setCurProd={setCurProd}
          />
        ))}
      </Carousel>
      {openModal && (
        <Compare
          curProd={curProd}
          compProd={compProd}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
}

RelatedItems.propTypes = {
  curProd: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  setCurProd: PropTypes.func.isRequired,
};
