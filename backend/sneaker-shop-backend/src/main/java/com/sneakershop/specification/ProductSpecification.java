package com.sneakershop.specification;

import com.sneakershop.entity.Product;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
public class ProductSpecification {

    public static Specification<Product> hasBrandId(Long brandId) {
        return (root, query, cb) ->
                brandId == null ? null : cb.equal(root.get("brand").get("id"), brandId);
    }

    public static Specification<Product> hasPriceBetween(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            if (min != null && max != null)
                return cb.between(root.get("price"), min, max);
            else if (min != null)
                return cb.greaterThanOrEqualTo(root.get("price"), min);
            else if (max != null)
                return cb.lessThanOrEqualTo(root.get("price"), max);
            else return null;
        };
    }

    public static Specification<Product> isActive(Boolean active) {
        return (root, query, cb) ->
                active == null ? null : cb.equal(root.get("isActive"), active);
    }

    public static Specification<Product> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.trim().isEmpty()) return null;
            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.like(cb.lower(root.get("name")), pattern);
        };
    }

    public static Specification<Product> hasColors(Set<String> colors) {
        return (root, query, cb) -> {
            if (colors == null || colors.isEmpty()) return null;
            Join<Product, String> colorJoin = root.joinSet("colors");
            query.distinct(true);
            return colorJoin.in(colors);
        };
    }

    public static Specification<Product> hasSizes(Set<String> sizes) {
        return (root, query, cb) -> {
            if (sizes == null || sizes.isEmpty()) return null;
            Join<Product, String> sizeJoin = root.joinSet("sizes");
            query.distinct(true);
            return sizeJoin.in(sizes);
        };
    }
}
