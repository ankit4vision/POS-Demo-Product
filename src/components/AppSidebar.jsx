import React from 'react'
import { CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'
import { AppSidebarNav } from './index'
import logo from '../assets/images/logo/logo1.png'

const AppSidebar = ({ sidebarShow, setSidebarShow, navigation }) => {
  // Detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 992;

  // Sidebar style with very light colorful gradient background
  const sidebarStyle = {
    background: 'linear-gradient(135deg, #e8f2ff 0%, #f0e8ff 25%, #fef8ff 50%, #fff0f5 75%, #e8f8ff 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
    borderRight: '2px solid rgba(66, 77, 43, 0.2)',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
  };

  return (
    <>
      <CSidebar
        position="fixed"
        visible={sidebarShow}
        onVisibleChange={setSidebarShow}
        style={sidebarStyle}
      >
        <CSidebarBrand className="d-none d-md-flex" style={{ position: 'relative' }}>
          <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto', padding: '15px' }} />
        </CSidebarBrand>
        <CSidebarNav>
          <AppSidebarNav items={navigation} setSidebarShow={setSidebarShow} />
        </CSidebarNav>
      </CSidebar>
    </>
  )
}

export default AppSidebar 