package com.sneakershop.config;

import com.sneakershop.entity.Role;
import com.sneakershop.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        seedRole("ROLE_USER", "Regular user role");
        seedRole("ROLE_ADMIN", "Administrator role");
    }

    private void seedRole(String name, String description) {
        if (!roleRepository.existsByName(name)) {
            Role role = new Role();
            role.setName(name);
            role.setDescription(description);
            role.setIsActive(true);
            role.setCreatedAt(LocalDateTime.now());
            role.setUpdatedAt(LocalDateTime.now());
            roleRepository.save(role);
        }
    }
}

