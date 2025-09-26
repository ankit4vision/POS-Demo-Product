import React from 'react'
import { CProgress, CProgressLabel } from '@coreui/react'

const WidgetsProgress = () => {
  return (
    <>
      <CProgress className="mb-3" height={20}>
        <CProgressLabel>Monthly Sales Target</CProgressLabel>
        <CProgressLabel>75%</CProgressLabel>
      </CProgress>
      <CProgress className="mb-3" height={20} color="success">
        <CProgressLabel>Customer Growth</CProgressLabel>
        <CProgressLabel>85%</CProgressLabel>
      </CProgress>
      <CProgress className="mb-3" height={20} color="info">
        <CProgressLabel>New Orders</CProgressLabel>
        <CProgressLabel>65%</CProgressLabel>
      </CProgress>
      <CProgress className="mb-3" height={20} color="warning">
        <CProgressLabel>Revenue Growth</CProgressLabel>
        <CProgressLabel>45%</CProgressLabel>
      </CProgress>
    </>
  )
}

export default WidgetsProgress 