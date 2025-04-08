import React from 'react';
import './Banner.css';

const Banner = ({ imageUrl, title}) => {
  return (
    <div className="banner" style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className="banner-content">
        <h1 className="banner-title">{title}</h1>
      </div>
    </div>
  );
};

export default Banner;
