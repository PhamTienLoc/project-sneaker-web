import React from 'react'
import { Link } from 'react-router-dom'
import { imageService } from '../services/imageService'

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return imageService.getImageUrl(product.images[0].path)
    }
    return 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400'
  }

  return (
    <Link to={`/products/${product.id}`} className="card group block">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={getProductImage()}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400'
          }}
        />
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-sm text-gray-500 mt-1">{product.brand.name}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          
          {product.colors && product.colors.length > 0 && (
            <div className="flex space-x-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-gray-500 ml-1">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 4).map((size, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

export default ProductCard