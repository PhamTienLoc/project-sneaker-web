import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { brandService } from '../services/brandService'
import BrandCard from '../components/BrandCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Pagination from '../components/Pagination'

const BrandsPage = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 12

  const { data: brandsData, isLoading, error } = useQuery({
    queryKey: ['brands', currentPage],
    queryFn: () =>
      brandService.getAllBrands({ page: currentPage, size: pageSize, sort: 'name,asc' }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-red-600">Có lỗi xảy ra khi tải thương hiệu: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Thương hiệu nổi tiếng
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Khám phá các thương hiệu giày thể thao hàng đầu thế giới
        </p>
        {brandsData?.result && (
          <p className="text-gray-500 mt-4">
            Tìm thấy {brandsData.result.totalElements} thương hiệu
          </p>
        )}
      </div>

      {/* Brands Grid */}
      {isLoading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : brandsData?.result?.content?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {brandsData.result.content.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={brandsData.result.number}
            totalPages={brandsData.result.totalPages}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy thương hiệu nào</p>
        </div>
      )}
    </div>
  )
}

export default BrandsPage
