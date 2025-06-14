package com.sneakershop.repository;

import com.sneakershop.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNameIgnoreCase(String name);

    @Query(value = "SELECT * FROM category c " +
            "WHERE c.id IN (SELECT category_id FROM product_category_ids WHERE product_id = :productId)", nativeQuery = true)
    List<Category> findAllByProductId(@Param("productId") Long productId);
}
