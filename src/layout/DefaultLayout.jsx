import React, { useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components'
import _nav from '../_nav.jsx'

const DefaultLayout = () => {
  const [sidebarShow, setSidebarShow] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= 992
  )
  return (
    <div>
      <AppSidebar navigation={_nav} sidebarShow={sidebarShow} setSidebarShow={setSidebarShow} />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader sidebarShow={sidebarShow} setSidebarShow={setSidebarShow} />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout 