import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Heart, Share2, ShoppingCart, Star } from 'lucide-react'
import { productService } from '../services/productService'
import { imageService } from '../services/imageService'
import { cartService } from '../services/cartService'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const ProductDetailPage = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id
  })

  const { data: relatedProducts } = useQuery({
    queryKey: ['relatedProducts', id],
    queryFn: () => productService.getRelatedProducts(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })

  const product = productData?.result

  const addToCartMutation = useMutation({
    mutationFn: (data) => cartService.addToCart(
      data.productId, 
      data.quantity,
      data.size,
      data.color
    ),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
      toast.success('Thêm vào giỏ hàng thành công')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Thêm vào giỏ hàng thất bại')
    }
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getProductImages = () => {
    if (product?.images && product.images.length > 0) {
      return product.images.map(img => imageService.getImageUrl(img.path))
    }
    return ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800']
  }

  const handleAddToCart = () => {
    if (!product) return
    
    if (!selectedSize) {
      toast.error('Vui lòng chọn kích cỡ')
      return
    }
    if (!selectedColor) {
      toast.error('Vui lòng chọn màu sắc')
      return
    }

    console.log('Product being added to cart:', product)
    addToCartMutation.mutate({
      productId: product.id,
      quantity,
      size: selectedSize,
      color: selectedColor
    })
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Đã sao chép link sản phẩm!')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner size="lg" className="py-12" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-red-600">Không tìm thấy sản phẩm</p>
          <Link to="/products" className="btn btn-primary mt-4">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    )
  }

  const images = getProductImages()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary-600">Sản phẩm</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <button
        onClick={() => window.history.back()}
        className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800'
              }}
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === index ? 'border-primary-600' : 'border-gray-200'}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.brand && (
              <p className="text-lg text-gray-600">
                Thương hiệu: <span className="font-medium">{product.brand.name}</span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
              <span className="text-gray-600 ml-2">(4.8)</span>
            </div>
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Màu sắc</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${selectedColor === color ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-gray-300 hover:border-gray-400'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Kích cỡ</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${selectedSize === size ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-gray-300 hover:border-gray-400'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2 text-gray-900">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
              className="flex-1 btn btn-primary py-3"
            >
              {addToCartMutation.isPending ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
            </button>

            <button
              onClick={handleShare}
              className="p-3 btn btn-outline"
              title="Chia sẻ sản phẩm"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {relatedProducts?.result && relatedProducts.result.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.result.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
