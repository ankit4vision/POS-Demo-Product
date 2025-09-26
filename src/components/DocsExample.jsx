import React from 'react'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'

const DocsExample = ({ children, href }) => {
  const _href = `https://coreui.io/react/docs/${href}`

  return (
    <div className="example">
      <CNav tabs>
        <CNavItem>
          <CNavLink active>Preview</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href={_href} target="_blank">
            Code
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent className="rounded-bottom">
        <CTabPane className="p-3 preview" visible>
          {children}
        </CTabPane>
      </CTabContent>
    </div>
  )
}

export default DocsExample 