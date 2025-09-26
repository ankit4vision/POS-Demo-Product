import React from 'react'
import IconsImg from '../assets/images/icons.webp'

const DocsIcons = () => {
  return (
    <div className="row">
      <div className="col-md col-12 px-lg-4">
        <img className="img-fluid" src={IconsImg} width="160px" height="160px" alt="CoreUI Icons" />
      </div>
      <div className="col-md col-12 px-lg-4">
        CoreUI Icons package is delivered with more than 1500 icons in multiple formats SVG, PNG, and
        Webfonts. CoreUI Icons are beautifully crafted symbols for common actions and items. You can use
        them in your digital products for web or mobile app.
      </div>
    </div>
  )
}

export default DocsIcons 