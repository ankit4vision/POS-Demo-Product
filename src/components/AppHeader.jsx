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
        background: '#3B721A',
        borderBottom: '2px solid rgba(167, 224, 107, 0.3)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={handleSidebarToggle}
          style={{ color: '#FFFFFF' }}
        >
          <CIcon icon={cilMenu} size="xl" style={{ color: '#FFFFFF' }} />
        </CHeaderToggler>
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#FFFFFF',
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
              background: 'rgba(167, 224, 107, 0.15)',
              border: '1px solid rgba(167, 224, 107, 0.3)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 24,
              padding: '4px 18px 4px 12px',
              fontWeight: 500,
              fontSize: 16,
              color: '#FFFFFF',
              minWidth: 220,
              gap: 8,
              fontFamily: 'monospace',
            }}
          >
            <CIcon icon={cilClock} className="me-2" style={{ color: '#A7E06B', fontSize: 20 }} />
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#FFFFFF' }}>{timeString}</span>
            <span style={{ color: '#A7E06B', fontWeight: 500 }}>| {dateString}</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, marginLeft: 4 }}>| {dayString}</span>
          </div>
          {hasPermission && hasPermission('create_pos') && (
            <Link 
              to="/sales/pos" 
              className="btn me-2 d-flex align-items-center" 
              title="Go to POS"
              style={{
                background: '#A7E06B',
                color: '#3B721A',
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
                color: '#FFFFFF',
                border: '1px solid rgba(167, 224, 107, 0.5)'
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
                color: '#FFFFFF',
                border: '1px solid rgba(167, 224, 107, 0.5)'
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