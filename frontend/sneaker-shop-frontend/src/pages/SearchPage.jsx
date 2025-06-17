import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { productService } from '../services/productService'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Pagination from '../components/Pagination'

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

  const pageSize = 12
  const query = searchParams.get('q') || ''

  // ✅ React Query v5 syntax
  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['search', query, currentPage],
    queryFn: () =>
      productService.searchProducts(query, {
        page: currentPage,
        size: pageSize,
      }),
    enabled: !!query,
    keepPreviousData: true,
    staleTime: 30000,
  })

  useEffect(() => {
    setSearchQuery(query)
    setCurrentPage(0)
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tìm kiếm sản phẩm</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập từ khóa tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-2 btn btn-primary px-6 py-2"
            >
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {query && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Kết quả tìm kiếm cho: "{query}"
          </h2>
          {searchResults?.result && (
            <p className="text-gray-600 mt-1">
              Tìm thấy {searchResults.result.totalElements} sản phẩm
            </p>
          )}
        </div>
      )}

      {/* Results */}
      {!query ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Nhập từ khóa để tìm kiếm sản phẩm
          </p>
        </div>
      ) : isLoading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">
            Có lỗi xảy ra khi tìm kiếm: {error.message}
          </p>
        </div>
      ) : searchResults?.result?.content?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {searchResults.result.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={searchResults.result.number}
            totalPages={searchResults.result.totalPages}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        </>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Không tìm thấy sản phẩm nào cho từ khóa "{query}"
          </p>
          <p className="text-gray-400 mt-2">
            Hãy thử tìm kiếm với từ khóa khác
          </p>
        </div>
      )}
    </div>
  )
}

export default SearchPage
