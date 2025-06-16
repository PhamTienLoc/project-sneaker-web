import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { Filter } from 'lucide-react'
import { productService } from '../services/productService'
import { brandService } from '../services/brandService'
import { categoryService } from '../services/categoryService'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Pagination from '../components/Pagination'

const ProductsPage = () => {
  const { brandId, categoryId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [filters, setFilters] = useState({
    brandId: brandId || '',
    categoryIds: categoryId ? [categoryId] : [],
    minPrice: '',
    maxPrice: '',
    colors: [],
    sizes: [],
    isActive: true
  })

  const pageSize = 12

  const getProducts = () => {
    const params = { page: currentPage, size: pageSize, sort: 'createdAt,desc' }

    if (brandId) {
      return productService.getProductsByBrand(brandId, params)
    } else if (categoryId) {
      return productService.getProductsByCategory(categoryId, params)
    } else {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => {
          if (Array.isArray(value)) return value.length > 0
          return value !== '' && value !== null && value !== undefined
        })
      )

      if (Object.keys(activeFilters).length > 0) {
        return productService.filterProducts(activeFilters, params)
      } else {
        return productService.getAllProducts(params)
      }
    }
  }

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', currentPage, filters, brandId, categoryId],
    queryFn: getProducts,
    keepPreviousData: true,
    staleTime: 30000,
  })

  const { data: brandsData } = useQuery({
    queryKey: ['brands-filter'],
    queryFn: () => brandService.getAllBrands({ page: 0, size: 100 }),
    staleTime: 10 * 60 * 1000,
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories-filter'],
    queryFn: () => categoryService.getAllCategories({ page: 0, size: 100 }),
    staleTime: 10 * 60 * 1000,
  })

  const { data: currentBrand } = useQuery({
    queryKey: ['brand', brandId],
    queryFn: () => brandService.getBrandById(brandId),
    enabled: !!brandId,
    staleTime: 10 * 60 * 1000,
  })

  const { data: currentCategory } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => categoryService.getCategoryById(categoryId),
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000,
  })

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setCurrentPage(0)
  }

  const handleArrayFilterChange = (key, value, checked) => {
    setFilters(prev => ({
      ...prev,
      [key]: checked
        ? [...prev[key], value]
        : prev[key].filter(item => item !== value)
    }))
    setCurrentPage(0)
  }

  const clearFilters = () => {
    setFilters({
      brandId: brandId || '',
      categoryIds: categoryId ? [categoryId] : [],
      minPrice: '',
      maxPrice: '',
      colors: [],
      sizes: [],
      isActive: true
    })
    setCurrentPage(0)
  }

  const getPageTitle = () => {
    if (currentBrand?.result) {
      return `Sản phẩm ${currentBrand.result.name}`
    }
    if (currentCategory?.result) {
      return `Sản phẩm ${currentCategory.result.name}`
    }
    return 'Tất cả sản phẩm'
  }

  const availableColors = ['Đen', 'Trắng', 'Xám', 'Đỏ', 'Xanh', 'Vàng', 'Hồng', 'Tím', 'Cam', 'Nâu', 'Xanh lá', 'Xanh dương']
  const COLOR_MAP = {
    'Đen': '#000000',
    'Trắng': '#ffffff',
    'Xám': '#808080',
    'Đỏ': '#ff0000',
    'Xanh': '#008000',
    'Vàng': '#ffff00',
    'Hồng': '#ff69b4',
    'Tím': '#800080',
    'Cam': '#ffa500',
    'Nâu': '#8b4513',
    'Xanh lá': '#00ff00',
    'Xanh dương': '#0000ff',
    'white': '#ffffff'
  }
  const availableSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45']

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-red-600">Có lỗi xảy ra khi tải sản phẩm: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          {productsData?.result && (
            <p className="text-gray-600 mt-2">
              Tìm thấy {productsData.result.totalElements} sản phẩm
            </p>
          )}
        </div>

        {!brandId && !categoryId && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline lg:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            Bộ lọc
          </button>
        )}
      </div>

      <div className="flex gap-8">
        {!brandId && !categoryId && (
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 space-y-6`}>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Xóa tất cả
                </button>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Thương hiệu</h4>
                <select
                  value={filters.brandId}
                  onChange={(e) => handleFilterChange('brandId', e.target.value)}
                  className="input w-full"
                >
                  <option value="">Tất cả thương hiệu</option>
                  {brandsData?.result?.content?.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Khoảng giá</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Màu sắc</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableColors.map((color) => (
                    <label key={color} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.colors.includes(color)}
                        onChange={(e) =>
                          handleArrayFilterChange('colors', color, e.target.checked)
                        }
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        title={color}
                        style={{ backgroundColor: COLOR_MAP[color] || '#fff' }}
                      ></div>
                      <span className="text-sm text-gray-700">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Kích cỡ</h4>
                <div className="grid grid-cols-3 gap-2">
                  {availableSizes.map((size) => (
                    <label key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.sizes.includes(size)}
                        onChange={(e) =>
                          handleArrayFilterChange('sizes', size, e.target.checked)
                        }
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : productsData?.result?.content?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {productsData.result.content.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Pagination
                currentPage={productsData.result.number}
                totalPages={productsData.result.totalPages}
                onPageChange={setCurrentPage}
                className="mt-8"
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
