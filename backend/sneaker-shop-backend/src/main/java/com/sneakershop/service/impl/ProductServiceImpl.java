package com.sneakershop.service.impl;

import com.sneakershop.dto.request.ProductCreateRequest;
import com.sneakershop.dto.request.ProductFilterRequest;
import com.sneakershop.dto.request.ProductUpdateRequest;
import com.sneakershop.dto.response.CategoryResponse;
import com.sneakershop.dto.response.ProductResponse;
import com.sneakershop.entity.Brand;
import com.sneakershop.entity.Category;
import com.sneakershop.entity.Product;
import com.sneakershop.exception.AppException;
import com.sneakershop.exception.ErrorCode;
import com.sneakershop.mapper.ProductMapper;
import com.sneakershop.repository.BrandRepository;
import com.sneakershop.repository.CategoryRepository;
import com.sneakershop.repository.ProductRepository;
import com.sneakershop.service.*;
import com.sneakershop.specification.ProductSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductServiceImpl implements ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;
    CategoryRepository categoryRepository;
    BrandRepository brandRepository;
    ImageService imageService;

    @Override
    public ProductResponse createProduct(ProductCreateRequest request) {
        Brand brand = brandRepository.findById(request.getBrandId()).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        if (productRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.PRODUCT_NAME_EXISTS);
        }

        Product product = productMapper.toProduct(request);
        product.setBrand(brand);
        product.setCategoryIds(new HashSet<>(request.getCategoryIds()));
        product = productRepository.save(product);

        ProductResponse response = productMapper.toProductResponse(product);
        response.setImages(imageService.getImagesByObject("product", product.getId()));
        response.setCategories(categoryRepository.findAllById(request.getCategoryIds()).stream()
                .map(category -> CategoryResponse.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .description(category.getDescription())
                        .createdAt(category.getCreatedAt())
                        .updatedAt(category.getUpdatedAt())
                        .isActive(category.getIsActive())
                        .build())
                .toList());
        return response;
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId()).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
            product.setBrand(brand);
        }

        if (request.getCategoryIds() != null) {
            product.setCategoryIds(new HashSet<>(request.getCategoryIds())); // <== THÊM DÒNG NÀY
        }

        productMapper.updateProduct(request, product);

        product = productRepository.save(product);
        ProductResponse response = productMapper.toProductResponse(product);
        response.setImages(imageService.getImagesByObject("product", product.getId()));
        if (request.getCategoryIds() != null) {
            response.setCategories(categoryRepository.findAllById(request.getCategoryIds()).stream()
                    .map(category -> CategoryResponse.builder()
                            .id(category.getId())
                            .name(category.getName())
                            .description(category.getDescription())
                            .createdAt(category.getCreatedAt())
                            .updatedAt(category.getUpdatedAt())
                            .isActive(category.getIsActive())
                            .build())
                    .toList());
        }
        return response;
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        ProductResponse response = productMapper.toProductResponse(product);
        response.setImages(imageService.getImagesByObject("product", product.getId()));
        response.setCategories(categoryRepository.findAllByProductId(product.getId()).stream()
                .map(category -> CategoryResponse.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .description(category.getDescription())
                        .createdAt(category.getCreatedAt())
                        .updatedAt(category.getUpdatedAt())
                        .isActive(category.getIsActive())
                        .build())
                .toList());
        return response;
    }

    @Override
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(product -> {
            ProductResponse response = productMapper.toProductResponse(product);
            response.setImages(imageService.getImagesByObject("product", product.getId()));
            response.setCategories(categoryRepository.findAllByProductId(product.getId()).stream()
                    .map(category -> CategoryResponse.builder()
                            .id(category.getId())
                            .name(category.getName())
                            .description(category.getDescription())
                            .createdAt(category.getCreatedAt())
                            .updatedAt(category.getUpdatedAt())
                            .isActive(category.getIsActive())
                            .build())
                    .toList());
            return response;
        });
    }

    @Override
    public Page<ProductResponse> filterProducts(ProductFilterRequest request, Pageable pageable) {
        Specification<Product> spec = Specification
                .where(ProductSpecification.hasBrandId(request.getBrandId()))
                .and(ProductSpecification.hasPriceBetween(request.getMinPrice(), request.getMaxPrice()))
                .and(ProductSpecification.isActive(request.getIsActive()))
                .and(ProductSpecification.hasKeyword(request.getKeyword()))
                .and(ProductSpecification.hasColors(request.getColors()))
                .and(ProductSpecification.hasSizes(request.getSizes()));

        Page<Product> productPage = productRepository.findAll(spec, pageable);

        return productPage.map(product -> {
            ProductResponse response = productMapper.toProductResponse(product);

            response.setImages(imageService.getImagesByObject("product", product.getId()));

            response.setCategories(categoryRepository.findAllByProductId(product.getId()).stream()
                    .map(category -> CategoryResponse.builder()
                            .id(category.getId())
                            .name(category.getName())
                            .description(category.getDescription())
                            .createdAt(category.getCreatedAt())
                            .updatedAt(category.getUpdatedAt())
                            .isActive(category.getIsActive())
                            .build())
                    .toList());
            return response;
        });
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductResponse> getRelatedProducts(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        List<Product> relatedProducts = productRepository.findTop5ByBrandAndIdNot(product.getBrand(), productId);

        return relatedProducts.stream().map(related -> {
            ProductResponse response = productMapper.toProductResponse(related);
            response.setImages(imageService.getImagesByObject("product", related.getId()));
            response.setCategories(categoryRepository.findAllByProductId(related.getId()).stream()
                    .map(category -> CategoryResponse.builder()
                            .id(category.getId())
                            .name(category.getName())
                            .description(category.getDescription())
                            .createdAt(category.getCreatedAt())
                            .updatedAt(category.getUpdatedAt())
                            .isActive(category.getIsActive())
                            .build())
                    .toList());
            return response;
        }).toList();
    }

    @Override
    public Page<ProductResponse> getProductsByBrand(Long brandId, Pageable pageable) {
        Brand brand = brandRepository.findById(brandId).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        return productRepository.findByBrand(brand, pageable).map(product -> {
            ProductResponse response = productMapper.toProductResponse(product);
            response.setImages(imageService.getImagesByObject("product", product.getId()));
            response.setCategories(categoryRepository.findAllByProductId(product.getId()).stream()
                    .map(category -> CategoryResponse.builder()
                            .id(category.getId())
                            .name(category.getName())
                            .description(category.getDescription())
                            .createdAt(category.getCreatedAt())
                            .updatedAt(category.getUpdatedAt())
                            .isActive(category.getIsActive())
                            .build())
                    .toList());
            return response;
        });
    }

    @Override
    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        return productRepository.findByCategoryId(categoryId, pageable).map(product -> {
            ProductResponse response = productMapper.toProductResponse(product);
            response.setImages(imageService.getImagesByObject("product", product.getId()));
            response.setCategories(categoryRepository.findAllByProductId(product.getId()).stream()
                    .map(c -> CategoryResponse.builder()
                            .id(c.getId())
                            .name(c.getName())
                            .description(c.getDescription())
                            .createdAt(c.getCreatedAt())
                            .updatedAt(c.getUpdatedAt())
                            .isActive(c.getIsActive())
                            .build())
                    .toList());
            return response;
        });
    }

    @Override
    public Map<String, Object> getProductStatistics(Integer pageSize) {
        long total = productRepository.count();
        int size = (pageSize == null || pageSize <= 0) ? 10 : pageSize;
        int totalPages = (int) Math.ceil((double) total / size);

        Map<String, Object> result = new HashMap<>();
        result.put("totalProducts", total);
        result.put("totalPages", totalPages);
        return result;
    }

    @Override
    public List<ProductResponse> getLatestProducts(int limit) {
        if (limit <= 0 || limit > 5) {
            throw new AppException(ErrorCode.INVALID_LIMIT);
        }

        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));

        return productRepository.findTopNByOrderByCreatedAtDesc(pageable).stream().map(product -> {
            ProductResponse response = productMapper.toProductResponse(product);
            response.setImages(imageService.getImagesByObject("product", product.getId()));
            response.setCategories(categoryRepository.findAllByProductId(product.getId()).stream()
                    .map(c -> CategoryResponse.builder()
                            .id(c.getId())
                            .name(c.getName())
                            .description(c.getDescription())
                            .createdAt(c.getCreatedAt())
                            .updatedAt(c.getUpdatedAt())
                            .isActive(c.getIsActive())
                            .build())
                    .toList());
            return response;
        }).toList();
    }
}