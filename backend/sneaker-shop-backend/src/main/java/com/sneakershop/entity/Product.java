package com.sneakershop.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;
    
    @Column(columnDefinition = "TEXT")
    String description;
    
    BigDecimal price;

    @ElementCollection
    Set<String> sizes;

    @ElementCollection
    Set<String> colors;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    Brand brand;

    @ElementCollection
    @CollectionTable(name = "product_category_ids", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "category_id")
    Set<Long> categoryIds;
}
