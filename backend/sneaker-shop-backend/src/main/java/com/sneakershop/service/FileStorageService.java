package com.sneakershop.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileStorageService {
    void init();

    String saveFile(String type, MultipartFile file);

    List<String> saveFiles(String type, MultipartFile[] files);

    Resource loadFile(String path);

    void deleteFile(String path);
}
