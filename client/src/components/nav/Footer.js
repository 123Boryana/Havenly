import React from 'react';
import './Footer.css';
import { Button } from '../home/Button';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer-container'>
      <section class='social-media'>
        <div class='social-media-wrap'>
          <div class='footer-logo'>
            <Link to='/' className='social-logo'>
              <i class='fa-solid fa-house mb-2' /> HAVENLY.
            </Link>
          </div>
          <small class='website-rights'>HAVENLY © 2025</small>
        </div>
      </section>
    </div>
  );
}

export default Footer;