import React from 'react'
import { CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'
import { AppSidebarNav } from './index'
import logo from '../assets/images/logo/logo1.png'

const AppSidebar = ({ sidebarShow, setSidebarShow, navigation }) => {
  // Detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 992;

  // Sidebar style for mobile width (let CoreUI handle it)
  const sidebarStyle = {};

  return (
    <>
      <CSidebar
        position="fixed"
        visible={sidebarShow}
        onVisibleChange={setSidebarShow}
        style={sidebarStyle}
      >
        <CSidebarBrand className="d-none d-md-flex" style={{ position: 'relative' }}>
          <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto' }} />
        </CSidebarBrand>
        <CSidebarNav>
          <AppSidebarNav items={navigation} setSidebarShow={setSidebarShow} />
        </CSidebarNav>
      </CSidebar>
    </>
  )
}

export default AppSidebar 