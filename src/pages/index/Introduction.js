import React from 'react'

function Introduction({ open, cb }) {
  return (
    <div className="introduction">
      <div className="portrait hide-on-phone">
        <img
          className="cmyk-image cmyk--0"
          src="https://sudo-portfolio-space.sfo2.digitaloceanspaces.com/images/c.png"
        />
        <img
          className="cmyk-image cmyk--1"
          src="https://sudo-portfolio-space.sfo2.digitaloceanspaces.com/images/m.png"
        />
        <img
          className="cmyk-image cmyk--2"
          src="https://sudo-portfolio-space.sfo2.digitaloceanspaces.com/images/y.png"
        />
        <img
          className="cmyk-image cmyk--3"
          src="https://sudo-portfolio-space.sfo2.digitaloceanspaces.com/images/k.png"
        />
      </div>
      <div className="intro__text">
        <h1>Hi</h1>
        <h2>My name is Jamie</h2>
        <h3>I make interesting experiences</h3>
        <p className="small italic cursor-pointer" onClick={cb}>
          {open ? 'collapse' : 'read more'}
        </p>
      </div>
    </div>
  )
}

export default Introduction
