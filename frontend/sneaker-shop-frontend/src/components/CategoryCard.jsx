import React from 'react'
import { Link } from 'react-router-dom'

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/categories/${category.id}/products`} className="card group">
      <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl font-bold text-white">
              {category.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4 text-center">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  )
}

export default CategoryCard