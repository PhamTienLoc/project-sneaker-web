import React from 'react'
import { Link } from 'react-router-dom'
import { imageService } from '../services/imageService'

const BrandCard = ({ brand }) => {
  const getBrandImage = () => {
    if (brand.images && brand.images.length > 0) {
      return imageService.getImageUrl(brand.images[0].path)
    }
    return 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400'
  }

  return (
    <Link to={`/brands/${brand.id}/products`} className="card group">
      <div className="aspect-square overflow-hidden bg-gray-100 flex items-center justify-center p-8">
        <img
          src={getBrandImage()}
          alt={brand.name}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400'
          }}
        />
      </div>
      
      <div className="p-4 text-center">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {brand.name}
        </h3>
        {brand.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {brand.description}
          </p>
        )}
      </div>
    </Link>
  )
}

export default BrandCard