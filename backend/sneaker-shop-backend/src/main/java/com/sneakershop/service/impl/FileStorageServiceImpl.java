package com.sneakershop.service.impl;

import com.sneakershop.exception.AppException;
import com.sneakershop.exception.ErrorCode;
import com.sneakershop.service.FileStorageService;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path rootPath = Paths.get("uploads");

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootPath);
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_INIT_FAILED);
        }
    }

    @Override
    public String saveFile(String type, MultipartFile file) {
        try {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path dir = rootPath.resolve(type);
            Files.createDirectories(dir);
            Path filePath = dir.resolve(filename);
            file.transferTo(filePath);
            return type + "/" + filename;
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    @Override
    public List<String> saveFiles(String type, MultipartFile[] files) {
        return Arrays.stream(files).map(file -> saveFile(type, file)).toList();
    }

    @Override
    public Resource loadFile(String path) {
        try {
            Path file = rootPath.resolve(path);
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists()) {
                throw new AppException(ErrorCode.FILE_NOT_FOUND);
            }
            return resource;
        } catch (MalformedURLException e) {
            throw new AppException(ErrorCode.FILE_LOAD_FAILED);
        }
    }

    @Override
    public void deleteFile(String path) {
        try {
            Files.deleteIfExists(rootPath.resolve(path));
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_DELETE_FAILED);
        }
    }
}
