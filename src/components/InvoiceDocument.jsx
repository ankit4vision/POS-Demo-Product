import React, { useState, useEffect } from 'react'
import { CSpinner } from '@coreui/react'
import { formatCurrency } from '../utils/currency'
import '../styles/invoice.css'

const InvoiceDocument = ({ purchase, showPaymentHistory = true }) => {
  const [payments, setPayments] = useState([])
  const [paymentsLoading, setPaymentsLoading] = useState(false)

  useEffect(() => {
    if (purchase?.id && showPaymentHistory) {
      fetchPayments()
    }
  }, [purchase?.id, showPaymentHistory])

  const fetchPayments = async () => {
    if (!purchase?.id) return
    
    try {
      setPaymentsLoading(true)
      const response = await fetch(`/api/purchases/${purchase.id}/payments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setPaymentsLoading(false)
    }
  }

  if (!purchase) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-GB')
  }

  const getFinancialValue = (key, fallback = 0) => {
    try {
      const value = purchase?.financial_summary?.[key]
      if (value === null || value === undefined || isNaN(value)) {
        return fallback
      }
      return parseFloat(value) || fallback
    } catch (error) {
      return fallback
    }
  }

  return (
    <div className="invoice-container" id="invoice-content">
      {/* Invoice Header */}
      <div className="invoice-header p-4 border-bottom">
        <div className="row">
          <div className="col-6">
            <h1 className="mb-2">PERFORMANCE</h1>
            <div className="info">
              <strong>Performance #:</strong> {purchase.reference_number}<br />
              <strong>Date:</strong> {formatDate(purchase.purchase_date)}<br />
              <strong>Status:</strong> {purchase.status}<br />
              <strong>Payment Status:</strong> {purchase.payment_status}
            </div>
          </div>
          <div className="col-6 supplier-info">
            <h4 className="mb-3">Supplier Information</h4>
            <div>
              <strong>{purchase.supplier?.name}</strong><br />
              {purchase.supplier?.email && (
                <>Email: {purchase.supplier.email}<br /></>
              )}
              {purchase.supplier?.phone && (
                <>Phone: {purchase.supplier.phone}<br /></>
              )}
              {purchase.supplier?.address && (
                <>Address: {purchase.supplier.address}</>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="invoice-items p-4">
        <h5 className="mb-3">Purchase Items</h5>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Received</th>
                <th>Cancelled</th>
                <th>Effective Qty</th>
                <th>Effective Total</th>
              </tr>
            </thead>
            <tbody>
              {purchase.items?.map((item, index) => {
                const effectiveQuantity = (item.quantity || 0) - (item.cancelled_quantity || 0)
                const effectiveTotal = effectiveQuantity * (item.unit_price || 0)
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{item.product?.product_name || item.product?.name}</strong>
                      {item.product?.sku && (
                        <>
                          <br /><small>SKU: {item.product.sku}</small>
                        </>
                      )}
                    </td>
                    <td className="text-center">{item.quantity || 0}</td>
                    <td className="text-end">{formatCurrency(item.unit_price || 0)}</td>
                    <td className="text-end">{formatCurrency((item.quantity || 0) * (item.unit_price || 0))}</td>
                    <td className="text-center">
                      <span className={`badge ${item.received_quantity >= item.quantity ? 'bg-success' : 'bg-warning'}`}>
                        {item.received_quantity || 0}
                      </span>
                    </td>
                    <td className="text-center">
                      {(item.cancelled_quantity || 0) > 0 ? (
                        <span className="badge bg-danger">{item.cancelled_quantity || 0}</span>
                      ) : (
                        <span>0</span>
                      )}
                    </td>
                    <td className="text-center">
                      <strong>{effectiveQuantity}</strong>
                    </td>
                    <td className="text-end">
                      <strong>{formatCurrency(effectiveTotal)}</strong>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="invoice-summary p-4 bg-light">
        <div className="row">
          <div className="col-6">
            <h6>Notes</h6>
            <p>
              {purchase.notes || 'No additional notes for this purchase.'}
            </p>
          </div>
          <div className="col-6">
            <div className="table-responsive">
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <td><strong>Total Ordered Value:</strong></td>
                    <td className="text-end">{formatCurrency(getFinancialValue('total_ordered_value', purchase.total_amount))}</td>
                  </tr>
                  {(getFinancialValue('total_cancelled_value', 0) > 0) && (
                    <tr>
                      <td><strong>Cancelled Value:</strong></td>
                      <td className="text-end">-{formatCurrency(getFinancialValue('total_cancelled_value', 0))}</td>
                    </tr>
                  )}
                  <tr>
                    <td><strong>Effective Amount Due:</strong></td>
                    <td className="text-end"><strong>{formatCurrency(getFinancialValue('effective_amount_due', 0))}</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Amount Paid:</strong></td>
                    <td className="text-end">{formatCurrency(getFinancialValue('amount_paid', 0))}</td>
                  </tr>
                  <tr>
                    <td><strong>Remaining Balance:</strong></td>
                    <td className="text-end"><strong>{formatCurrency(getFinancialValue('remaining_balance', 0))}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="invoice-payment p-4">
        <h6>Payment Progress</h6>
        <div className="progress mb-2" style={{height: '20px'}}>
          <div 
            className="progress-bar bg-success" 
            style={{width: `${Math.min(100, Math.max(0, getFinancialValue('payment_progress', 0)))}%`}}
          >
            {Math.min(100, Math.max(0, getFinancialValue('payment_progress', 0)))}%
          </div>
        </div>
        <small>
          {formatCurrency(getFinancialValue('amount_paid', 0))} of {formatCurrency(getFinancialValue('effective_amount_due', 0))} paid
        </small>
      </div>

      {/* Payment History */}
      {showPaymentHistory && (
        <div className="payment-history p-4">
          <h6>Payment History</h6>
          {paymentsLoading ? (
            <div className="text-center py-3">
              <CSpinner size="sm" />
              <p className="mt-2">Loading payment history...</p>
            </div>
          ) : payments.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Reference</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={payment.id}>
                      <td>{index + 1}</td>
                      <td>{formatDate(payment.payment_date)}</td>
                      <td className="text-end">{formatCurrency(payment.amount)}</td>
                      <td>{payment.payment_method}</td>
                      <td>{payment.reference_number || 'N/A'}</td>
                      <td>{payment.notes || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No payment history available.</p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="invoice-footer p-4 border-top text-center">
        <p className="mb-0">
          This is a computer-generated performance. Please contact us for any discrepancies.
        </p>
      </div>
    </div>
  )
}

export default InvoiceDocument 