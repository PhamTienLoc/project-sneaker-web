package com.sneakershop.config;

import com.sneakershop.entity.Role;
import com.sneakershop.entity.User;
import com.sneakershop.repository.RoleRepository;
import com.sneakershop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedRole("ROLE_USER", "Regular user role");
        seedRole("ROLE_ADMIN", "Administrator role");
        seedAdminUser();
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

    private void seedAdminUser() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@sneakershop.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setPhoneNumber("0123456789");
            admin.setAddress("Admin Address");
            admin.setIsActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());

            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName("ROLE_ADMIN").orElseThrow());
            roles.add(roleRepository.findByName("ROLE_USER").orElseThrow());
            admin.setRoles(roles);

            userRepository.save(admin);
        }
    }
}

