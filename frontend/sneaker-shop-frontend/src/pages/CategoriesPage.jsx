import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { categoryService } from '../services/categoryService'
import CategoryCard from '../components/CategoryCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Pagination from '../components/Pagination'

const CategoriesPage = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 12

  const { data: categoriesData, isLoading, error } = useQuery({
    queryKey: ['categories', currentPage],
    queryFn: () =>
      categoryService.getAllCategories({
        page: currentPage,
        size: pageSize,
        sort: 'name,asc',
      }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-red-600">Có lỗi xảy ra khi tải danh mục: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Danh mục sản phẩm
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Tìm kiếm sản phẩm theo danh mục phù hợp với nhu cầu của bạn
        </p>
        {categoriesData?.result && (
          <p className="text-gray-500 mt-4">
            Tìm thấy {categoriesData.result.totalElements} danh mục
          </p>
        )}
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : categoriesData?.result?.content?.length > 0 ? (
        <>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {categoriesData.result.content.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={categoriesData.result.number}
            totalPages={categoriesData.result.totalPages}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy danh mục nào</p>
        </div>
      )}
    </div>
  )
}

export default CategoriesPage
