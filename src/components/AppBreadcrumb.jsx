import React from 'react'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { useLocation, Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilHome, cilSpeedometer, cilCart, cilTruck, cilUser, cilMoney, cilSettings } from '@coreui/icons'

const FRIENDLY_NAMES = {
  'dashboard': { label: 'Dashboard', icon: cilSpeedometer },
  'sales': { label: 'Sales', icon: cilCart },
  'purchases': { label: 'Purchases', icon: cilTruck },
  'customers': { label: 'Customers', icon: cilUser },
  'employees': { label: 'Employees', icon: cilUser },
  'expenses': { label: 'Expenses', icon: cilMoney },
  'settings': { label: 'Settings', icon: cilSettings },
  'profile': { label: 'Profile', icon: cilUser },
}

function toTitleCase(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const AppBreadcrumb = () => {
  return null
}

export default AppBreadcrumb 