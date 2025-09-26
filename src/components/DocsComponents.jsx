import React from 'react'
import ComponentsImg from '../assets/images/components.webp'

const DocsComponents = () => {
  return (
    <div className="row">
      <div className="col-md col-12 px-lg-4">
        <img
          className="img-fluid"
          src={ComponentsImg}
          width="160px"
          height="160px"
          alt="CoreUI Components"
        />
      </div>
      <div className="col-md col-12 px-lg-4">
        Our Admin Panel isn't just a mix of third-party components. It's{' '}
        <strong>a complete design system</strong> that provides a comprehensive set of reusable,
        accessible, and responsive components.
      </div>
    </div>
  )
}

export default DocsComponents 