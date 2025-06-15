import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react'
import { productService } from '../services/productService'
import { brandService } from '../services/brandService'
import ProductCard from '../components/ProductCard'
import BrandCard from '../components/BrandCard'
import LoadingSpinner from '../components/LoadingSpinner'

const HomePage = () => {
  const { data: latestProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['latestProducts'],
    queryFn: () => productService.getLatestProducts(4),
    staleTime: 5 * 60 * 1000,
  })

  const { data: brandsData, isLoading: isLoadingBrands } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandService.getAllBrands({ page: 0, size: 6 }),
    staleTime: 10 * 60 * 1000,
  })

  const features = [
    {
      icon: Truck,
      title: 'Giao hàng miễn phí',
      description: 'Miễn phí giao hàng cho đơn hàng trên 500.000đ'
    },
    {
      icon: Shield,
      title: 'Bảo hành chính hãng',
      description: 'Cam kết 100% sản phẩm chính hãng'
    },
    {
      icon: Headphones,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ tư vấn nhiệt tình, chuyên nghiệp'
    },
    {
      icon: Star,
      title: 'Chất lượng đảm bảo',
      description: 'Sản phẩm được kiểm tra kỹ lưỡng trước khi giao'
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Khám phá
                <span className="block text-yellow-400">Sneaker</span>
                Đỉnh cao
              </h1>
              <p className="text-xl text-primary-100 leading-relaxed">
                Bộ sưu tập giày thể thao cao cấp từ những thương hiệu hàng đầu thế giới. 
                Phong cách, chất lượng và sự thoải mái hoàn hảo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="btn btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                >
                  Khám phá ngay
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/brands"
                  className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold"
                >
                  Xem thương hiệu
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Premium Sneakers"
                className="w-full h-auto rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full opacity-80 animate-bounce-subtle"></div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full opacity-60 animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4 p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sản phẩm mới nhất
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Cập nhật những mẫu giày thể thao hot nhất từ các thương hiệu nổi tiếng
          </p>
        </div>

        {isLoadingProducts ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {latestProducts?.result?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/products"
            className="btn btn-primary px-8 py-3 text-lg"
          >
            Xem tất cả sản phẩm
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Brands Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Thương hiệu nổi tiếng
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Hợp tác với những thương hiệu hàng đầu thế giới
            </p>
          </div>

          {isLoadingBrands ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
              {brandsData?.result?.content?.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/brands"
              className="btn btn-primary px-8 py-3 text-lg"
            >
              Xem tất cả thương hiệu
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Đăng ký nhận thông tin mới nhất
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Nhận thông báo về sản phẩm mới, khuyến mãi đặc biệt và xu hướng thời trang
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="btn btn-primary px-6 py-3 whitespace-nowrap">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage