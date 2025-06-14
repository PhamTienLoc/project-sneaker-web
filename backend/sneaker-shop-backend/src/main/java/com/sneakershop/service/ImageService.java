package com.sneakershop.service;

import com.sneakershop.dto.response.ImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {
    List<ImageResponse> uploadImages(String type, Long objectId, MultipartFile[] files);

    List<ImageResponse> getImagesByObject(String type, Long objectId);

    void deleteImage(String filename);
}
