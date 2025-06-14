package com.sneakershop.controller;

import com.sneakershop.dto.response.ApiResponse;
import com.sneakershop.dto.response.ImageResponse;
import com.sneakershop.service.FileStorageService;
import com.sneakershop.service.ImageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ImageController {
    ImageService imageService;
    FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ApiResponse<List<ImageResponse>> uploadImages(@RequestParam("type") String type, @RequestParam("objectId") Long objectId, @RequestParam("files") MultipartFile[] files) {
        return ApiResponse.<List<ImageResponse>>builder()
                .message("Upload thành công")
                .result(imageService.uploadImages(type, objectId, files))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ImageResponse>> getImages(@RequestParam("type") String type, @RequestParam("objectId") Long objectId) {
        return ApiResponse.<List<ImageResponse>>builder()
                .message("Lấy danh sách ảnh thành công")
                .result(imageService.getImagesByObject(type, objectId))
                .build();
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadImage(@RequestParam String path) {
        Resource file = fileStorageService.loadFile(path);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    @DeleteMapping
    public ApiResponse<Void> deleteImage(@RequestParam String path) {
        imageService.deleteImage(path);
        return ApiResponse.<Void>builder()
                .message("Xoá ảnh thành công")
                .build();
    }
}

