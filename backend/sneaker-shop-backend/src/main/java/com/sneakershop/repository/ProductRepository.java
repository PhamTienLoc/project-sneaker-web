package com.sneakershop.repository;

import com.sneakershop.entity.Brand;
import com.sneakershop.entity.Category;
import com.sneakershop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findTop5ByBrandAndIdNot(Brand brand, Long excludedProductId);

    Page<Product> findByBrand(Brand brand, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN p.categoryIds cId WHERE cId = :categoryId")
    Page<Product> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p ORDER BY p.createdAt DESC")
    List<Product> findTopNByOrderByCreatedAtDesc(Pageable pageable);

    boolean existsByName(String name);
}