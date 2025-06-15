import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <div className="text-6xl">😕</div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Trang không tìm thấy
        </h2>
        
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </button>
          
          <Link to="/" className="btn btn-primary px-6 py-3">
            <Home className="w-4 h-4 mr-2" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage