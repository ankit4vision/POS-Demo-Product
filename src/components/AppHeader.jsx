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
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={handleSidebarToggle}
        >
          <CIcon icon={cilMenu} size="xl" />
        </CHeaderToggler>
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: 'rgb(50, 31, 219)',
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
              background: '#fff',
              border: '1px solid #e9ecef',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              borderRadius: 24,
              padding: '4px 18px 4px 12px',
              fontWeight: 500,
              fontSize: 16,
              color: '#321fdb',
              minWidth: 220,
              gap: 8,
              fontFamily: 'monospace',
            }}
          >
            <CIcon icon={cilClock} className="me-2" style={{ color: '#321fdb', fontSize: 20 }} />
            <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{timeString}</span>
            <span style={{ color: '#555', fontWeight: 500 }}>| {dateString}</span>
            <span style={{ color: '#aaa', fontSize: 14, marginLeft: 4 }}>| {dayString}</span>
          </div>
          {hasPermission && hasPermission('create_pos') && (
            <Link to="/sales/pos" className="btn btn-primary me-2 d-flex align-items-center" title="Go to POS">
              <CIcon icon={cilBarcode} className="me-1" /> POS
            </Link>
          )}
          {hasPermission && hasPermission('view_setting') && (
            <Link to="/settings" className="btn btn-outline-secondary me-2 d-flex align-items-center" title="Settings">
              <CIcon icon={cilSettings} />
            </Link>
          )}
          {hasPermission && hasPermission('view_email') && (
            <Link to="/emails/inbox" className="btn btn-outline-info me-2 d-flex align-items-center" title="Email Inbox">
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