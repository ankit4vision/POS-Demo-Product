import React from 'react'

const AppFooter = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="app-footer">
      <div>
        <span>&copy; {currentYear}</span>
      </div>
    </footer>
  )
}

export default AppFooter 