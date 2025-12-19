import React from 'react'
import { CHeader, CHeaderNav, CHeaderToggler, CContainer } from '@coreui/react'
import { useAuth } from '../context/AuthContext'
import AppHeaderDropdown from './header/AppHeaderDropdown'
import { Link } from 'react-router-dom'
import { cilBarcode, cilClock, cilSettings, cilEnvelopeClosed, cilMenu } from '@coreui/icons'
import { CIcon } from '@coreui/icons-react'
import { useState, useEffect } from 'react'

const AppHeader = ({ sidebarShow, setSidebarShow }) => {
  const { logout, user, hasPermission } = useAuth()

  // Live clock state
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateString = now.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
  const dayString = now.toLocaleDateString('en-GB', { weekday: 'short' })

  const handleSidebarToggle = () => {
    console.log('Sidebar toggler clicked. Current:', sidebarShow);
    setSidebarShow(!sidebarShow);
  };

  return (
    <CHeader 
      position="sticky" 
      className="mb-4"
      style={{
        background: '#FFFFFF',
        borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
    >
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={handleSidebarToggle}
          style={{ color: '#3B721A' }}
        >
          <CIcon icon={cilMenu} size="xl" style={{ color: '#3B721A' }} />
        </CHeaderToggler>
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#3B721A',
              letterSpacing: 1,
              minWidth: 220,
              textAlign: 'center',
            }}
          >
            {`Welcome, ${user?.name || 'User'}!`}
          </div>
        </div>
        <CHeaderNav className="ms-auto">
          <div
            className="d-flex align-items-center me-3"
            style={{
              background: 'rgba(59, 114, 26, 0.08)',
              border: '1px solid rgba(59, 114, 26, 0.2)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              borderRadius: 24,
              padding: '4px 18px 4px 12px',
              fontWeight: 500,
              fontSize: 16,
              color: '#3B721A',
              minWidth: 220,
              gap: 8,
              fontFamily: 'monospace',
            }}
          >
            <CIcon icon={cilClock} className="me-2" style={{ color: '#3B721A', fontSize: 20 }} />
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#3B721A' }}>{timeString}</span>
            <span style={{ color: '#3B721A', fontWeight: 500, opacity: 0.8 }}>| {dateString}</span>
            <span style={{ color: 'rgba(59, 114, 26, 0.6)', fontSize: 14, marginLeft: 4 }}>| {dayString}</span>
          </div>
          {hasPermission && hasPermission('create_pos') && (
            <Link 
              to="/sales/pos" 
              className="btn me-2 d-flex align-items-center" 
              title="Go to POS"
              style={{
                background: '#3B721A',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600
              }}
            >
              <CIcon icon={cilBarcode} className="me-1" /> POS
            </Link>
          )}
          {hasPermission && hasPermission('view_setting') && (
            <Link 
              to="/settings" 
              className="btn me-2 d-flex align-items-center" 
              title="Settings"
              style={{
                background: 'transparent',
                color: '#3B721A',
                border: '1px solid rgba(59, 114, 26, 0.3)'
              }}
            >
              <CIcon icon={cilSettings} />
            </Link>
          )}
          {hasPermission && hasPermission('view_email') && (
            <Link 
              to="/emails/inbox" 
              className="btn me-2 d-flex align-items-center" 
              title="Email Inbox"
              style={{
                background: 'transparent',
                color: '#3B721A',
                border: '1px solid rgba(59, 114, 26, 0.3)'
              }}
            >
              <CIcon icon={cilEnvelopeClosed} />
            </Link>
          )}
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader 