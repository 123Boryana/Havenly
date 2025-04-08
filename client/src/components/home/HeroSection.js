import React from 'react';
import '../../App.css';
import { SearchButton } from './SearchButton';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className='hero-container'>
      <h1>Приключението започва</h1>
      <p>Намери мечтания си имот</p>
      <div className='hero-btns'>
        <SearchButton
          className='btns'
          buttonStyle="btn--primary" 
          buttonSize='btn--large'
        >
          <b>ТЪРСЕНЕ</b>
        </SearchButton>
      </div>
    </div>
  );
}

export default HeroSection;