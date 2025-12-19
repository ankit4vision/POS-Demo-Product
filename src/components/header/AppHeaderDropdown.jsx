import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilUser,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useAuth } from '../../context/AuthContext'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar 
          size="md"
          style={{
            backgroundColor: '#A7E06B',
            color: '#3B721A',
            fontWeight: 700
          }}
        >
          {user?.name?.charAt(0) || 'U'}
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end" style={{ border: '1px solid rgba(59, 114, 26, 0.2)' }}>
        <CDropdownHeader 
          className="fw-semibold py-2"
          style={{
            background: '#3B721A',
            color: '#FFFFFF'
          }}
        >
          {user?.name || 'User'}
        </CDropdownHeader>
        <CDropdownItem onClick={() => navigate('/profile')} style={{ color: '#3B721A' }}>
          <CIcon icon={cilUser} className="me-2" style={{ color: '#3B721A' }} />
          Profile
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout} style={{ color: '#3B721A' }}>
          <CIcon icon={cilAccountLogout} className="me-2" style={{ color: '#3B721A' }} />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown 