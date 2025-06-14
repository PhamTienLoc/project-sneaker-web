package com.sneakershop.repository;

import com.sneakershop.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByTypeAndObjectId(String type, Long objectId);

    Optional<Image> findByPath(String path);
}
