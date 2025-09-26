import React from 'react'
import { CLink } from '@coreui/react'

const DocsLink = ({ href, text }) => {
  return (
    <div className="float-end">
      <CLink href={href} target="_blank" rel="noopener noreferrer">
        <small className="text-body-secondary">{text || 'docs'}</small>
      </CLink>
    </div>
  )
}

export default DocsLink 