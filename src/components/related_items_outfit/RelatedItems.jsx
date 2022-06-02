import axios from 'axios';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Carousel from './Carousel';
import ProductCard from './RIProductCard';

import config from '../../../config/config';

export default function RelatedItems({ curProd }) {
  const [relatedItemIDs, setRelatedItemIDs] = useState([]);

  const url = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/';
  useEffect(() => {
    axios
      .get(`${url}products/${curProd.id}/related`, {
        headers: { Authorization: config.TOKEN },
      })
      .then((results) => setRelatedItemIDs(results.data));
  }, [curProd]);

  console.log(relatedItemIDs);

  return (
    <div className="related-items">
      <h2 className="ri-header fade-in">Related Items</h2>
      <div>
        <Carousel>
          {relatedItemIDs.map((productID) => (
            <ProductCard
              curProd={curProd}
              productID={productID}
              key={productID}
            />
          ))}
        </Carousel>
      </div>
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
};
