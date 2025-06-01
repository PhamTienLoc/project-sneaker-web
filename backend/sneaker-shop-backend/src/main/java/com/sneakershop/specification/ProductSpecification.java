package com.sneakershop.specification;

import com.sneakershop.entity.Product;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.*;

import java.util.List;

public class ProductSpecification {

    public static Specification<Product> hasBrandId(Long brandId) {
        return (root, query, criteriaBuilder) ->
                brandId == null ? null : criteriaBuilder.equal(root.get("brand").get("id"), brandId);
    }

    public static Specification<Product> hasCategoryIds(List<Long> categoryIds) {
        return (root, query, criteriaBuilder) -> {
            if (categoryIds == null || categoryIds.isEmpty()) return null;
            Join<Object, Object> categories = root.join("categories");
            return categories.get("id").in(categoryIds);
        };
    }

    public static Specification<Product> hasPriceBetween(Double min, Double max) {
        return (root, query, criteriaBuilder) -> {
            if (min != null && max != null)
                return criteriaBuilder.between(root.get("price"), min, max);
            else if (min != null)
                return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), min);
            else if (max != null)
                return criteriaBuilder.lessThanOrEqualTo(root.get("price"), max);
            else
                return null;
        };
    }

    public static Specification<Product> isActive(Boolean active) {
        return (root, query, criteriaBuilder) ->
                active == null ? null : criteriaBuilder.equal(root.get("isActive"), active);
    }

    public static Specification<Product> hasKeyword(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.trim().isEmpty()) return null;
            String pattern = "%" + keyword.toLowerCase() + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern)
            );
        };
    }
}
