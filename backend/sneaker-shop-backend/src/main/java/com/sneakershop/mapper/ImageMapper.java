package com.sneakershop.mapper;

import com.sneakershop.dto.response.ImageResponse;
import com.sneakershop.entity.Image;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ImageMapper {
    ImageResponse toResponse(Image image);

    List<ImageResponse> toResponseList(List<Image> images);
}
