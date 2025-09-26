import React from 'react'
import { CWidgetStatsF } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilCart, cilChart, cilDollar } from '@coreui/icons'

const WidgetsDropdown = () => {
  return (
    <>
      <CWidgetStatsF
        className="mb-3"
        icon={<CIcon icon={cilPeople} height={24} />}
        title="Total Customers"
        value="1,234"
        color="primary"
      />
      <CWidgetStatsF
        className="mb-3"
        icon={<CIcon icon={cilCart} height={24} />}
        title="Total Sales"
        value="$45,678"
        color="success"
      />
      <CWidgetStatsF
        className="mb-3"
        icon={<CIcon icon={cilChart} height={24} />}
        title="Total Orders"
        value="567"
        color="info"
      />
      <CWidgetStatsF
        className="mb-3"
        icon={<CIcon icon={cilDollar} height={24} />}
        title="Total Revenue"
        value="$89,012"
        color="warning"
      />
    </>
  )
}

export default WidgetsDropdown
