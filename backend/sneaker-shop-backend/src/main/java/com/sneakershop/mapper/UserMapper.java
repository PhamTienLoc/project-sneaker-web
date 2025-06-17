package com.sneakershop.mapper;

import com.sneakershop.dto.request.RegisterRequest;
import com.sneakershop.dto.request.UserUpdateRequest;
import com.sneakershop.dto.response.UserResponse;
import com.sneakershop.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "roles", expression = "java(mapRoles(user))")
    UserResponse toResponse(User user);

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    User toEntity(RegisterRequest request);

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);

    default List<String> mapRoles(User user) {
        return user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList());
    }
}