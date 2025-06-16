import React from 'react'
import { Link } from 'react-router-dom'

const ThankYouPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-16">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Cảm ơn bạn đã đặt hàng!</h1>
      <p className="mb-8 text-lg text-gray-700">Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ và giao hàng sớm nhất có thể.</p>
      <div className="flex gap-4">
        <Link to="/" className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700">Về trang chủ</Link>
        <Link to="/my-orders" className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300">Xem đơn hàng của tôi</Link>
      </div>
    </div>
  )
}

export default ThankYouPage 