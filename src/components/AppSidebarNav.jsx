import React from 'react'
import { CSidebarNav } from '@coreui/react'
import { useLocation, NavLink } from 'react-router-dom'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { useAuth } from '../context/AuthContext'

const AppSidebarNav = ({ items, setSidebarShow }) => {
  const location = useLocation()
  const { hasAnyPermission, hasRole } = useAuth()

  // Filter items based on permissions
  const filterItemsByPermissions = (navItems) => {
    return navItems.filter(item => {
      // Admin role can see everything
      if (hasRole('admin')) {
        return true
      }

      // If no permissions required, show the item
      if (!item.permissions || item.permissions.length === 0) {
        return true
      }

      // Check if user has any of the required permissions
      return hasAnyPermission(item.permissions)
    }).map(item => {
      // If item has sub-items, filter them too
      if (item.items && item.items.length > 0) {
        const filteredSubItems = filterItemsByPermissions(item.items)
        
        // Only show parent item if it has visible sub-items
        if (filteredSubItems.length > 0) {
          return {
            ...item,
            items: filteredSubItems
          }
        }
        return null
      }
      return item
    }).filter(Boolean) // Remove null items
  }

  const filteredItems = filterItemsByPermissions(items)

  const renderNavItem = (item, index) => {
    if (item.component === CNavTitle) {
      return (
        <CNavTitle key={index}>
          {item.name}
        </CNavTitle>
      )
    }

    if (item.component === CNavGroup) {
      return (
        <CNavGroup
          key={index}
          toggler={item.name}
          icon={item.icon}
          visible={item.visible}
        >
          {item.items?.map((subItem, subIndex) => renderNavItem(subItem, subIndex))}
        </CNavGroup>
      )
    }

    // Handle disabled items
    if (item.disabled) {
      return (
        <CNavItem key={index} icon={item.icon} className="nav-item-disabled">
          <div className="nav-link disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            {item.icon}
            <span className="nav-text ms-2">{item.name}</span>
            {item.label && (
              <span className="badge bg-secondary ms-auto" style={{ fontSize: '0.7rem' }}>
                {item.label}
              </span>
            )}
          </div>
        </CNavItem>
      )
    }

    return (
      <CNavItem key={index} icon={item.icon}>
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            'nav-link' + (isActive ? ' active' : '')
          }
          end
          onClick={() => {
            if (setSidebarShow && typeof window !== 'undefined' && window.innerWidth < 992) {
              setSidebarShow(false);
            }
          }}
        >
          {item.icon}
          <span className="nav-text ms-2">{item.name}</span>
          {item.label && (
            <span className="badge bg-secondary ms-auto" style={{ fontSize: '0.7rem' }}>
              {item.label}
            </span>
          )}
        </NavLink>
      </CNavItem>
    )
  }

  return (
    <CSidebarNav>
      {filteredItems.map((item, index) => renderNavItem(item, index))}
    </CSidebarNav>
  )
}

export default AppSidebarNav 