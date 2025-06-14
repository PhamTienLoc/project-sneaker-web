package com.sneakershop.service.impl;

import com.sneakershop.dto.response.ImageResponse;
import com.sneakershop.entity.Image;
import com.sneakershop.exception.AppException;
import com.sneakershop.exception.ErrorCode;
import com.sneakershop.mapper.ImageMapper;
import com.sneakershop.repository.ImageRepository;
import com.sneakershop.service.FileStorageService;
import com.sneakershop.service.ImageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ImageServiceImpl implements ImageService {
    ImageRepository imageRepository;
    FileStorageService fileStorageService;
    ImageMapper imageMapper;

    static Set<String> VALID_IMAGE_TYPES = Set.of("product", "brand", "blog");
    static Set<String> VALID_CONTENT_TYPES = Set.of("image/png", "image/jpeg", "image/jpg", "image/webp");

    @Override
    public List<ImageResponse> uploadImages(String type, Long objectId, MultipartFile[] files) {
        if (!VALID_IMAGE_TYPES.contains(type.toLowerCase())) {
            throw new AppException(ErrorCode.INVALID_IMAGE_TYPE);
        }

        if (files == null || files.length == 0) {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }

        for (MultipartFile file : files) {
            if (!VALID_CONTENT_TYPES.contains(file.getContentType())) {
                throw new AppException(ErrorCode.UNSUPPORTED_FILE_FORMAT);
            }
        }

        List<String> paths;
        try {
            paths = fileStorageService.saveFiles(type, files);
        } catch (Exception e) {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }

        List<Image> images = paths.stream().map(path -> {
            Image image = new Image();
            image.setPath(path);
            image.setType(type);
            image.setObjectId(objectId);
            return image;
        }).toList();

        try {
            imageRepository.saveAll(images);
        } catch (Exception e) {
            throw new AppException(ErrorCode.IMAGE_SAVE_FAILED);
        }

        return imageMapper.toResponseList(images);
    }

    @Override
    public List<ImageResponse> getImagesByObject(String type, Long objectId) {
        if (!VALID_IMAGE_TYPES.contains(type.toLowerCase())) {
            throw new AppException(ErrorCode.INVALID_IMAGE_TYPE);
        }

        List<Image> images = imageRepository.findByTypeAndObjectId(type, objectId);
        if (images.isEmpty()) {
            throw new AppException(ErrorCode.IMAGE_NOT_FOUND);
        }

        return imageMapper.toResponseList(images);
    }

    @Override
    public void deleteImage(String path) {
        Image image = imageRepository.findByPath(path).orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

        fileStorageService.deleteFile(path);

        imageRepository.delete(image);
    }
}
