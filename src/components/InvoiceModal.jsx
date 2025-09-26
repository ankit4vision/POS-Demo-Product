import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPrint, cilSave, cilX } from '@coreui/icons'
import InvoiceDocument from './InvoiceDocument'
import { printInvoice, downloadInvoicePDF } from '../utils/invoiceUtils'
import '../styles/invoice.css'

const InvoiceModal = ({ visible, onClose, purchase, onPrint }) => {
  const [loading, setLoading] = useState(false)

  if (!purchase) return null

  const handlePrint = () => {
    setLoading(true)
    setTimeout(() => {
      printInvoice(purchase, true, `Performance - ${purchase.reference_number}`)
      setLoading(false)
    }, 500)
  }

  const handleDownload = () => {
    setLoading(true)
    setTimeout(() => {
      downloadInvoicePDF(purchase, true)
      setLoading(false)
    }, 500)
  }

  return (
    <CModal 
      visible={visible} 
      onClose={onClose} 
      size="xl" 
      fullscreen="lg"
      className="invoice-modal"
    >
      <CModalHeader onClose={onClose}>
        <CModalTitle>
          <CIcon icon={cilPrint} className="me-2" />
          Performance - {purchase.reference_number}
        </CModalTitle>
      </CModalHeader>
      
      <CModalBody className="p-0">
        <InvoiceDocument purchase={purchase} showPaymentHistory={true} />
      </CModalBody>
      
      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={onClose}
          disabled={loading}
        >
          <CIcon icon={cilX} className="me-1" />
          Close
        </CButton>
        <CButton 
          color="info" 
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? <CSpinner size="sm" /> : <CIcon icon={cilSave} className="me-1" />}
          Download PDF
        </CButton>
        <CButton 
          color="primary" 
          onClick={handlePrint}
          disabled={loading}
        >
          {loading ? <CSpinner size="sm" /> : <CIcon icon={cilPrint} className="me-1" />}
          Print Performance
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default InvoiceModal 