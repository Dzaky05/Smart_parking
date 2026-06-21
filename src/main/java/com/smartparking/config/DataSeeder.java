package com.smartparking.config;

import com.smartparking.model.entity.User;
import com.smartparking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        // Seed default admin user
        if (!userRepository.existsByUsername("admin@gmail.com")) {
            User admin = new User("admin@gmail.com", "admin123", "ADMIN", "Administrator");
            userRepository.save(admin);
            System.out.println("✅ Default admin user created (admin@gmail.com/admin123)");
        }

        // Seed default petugas user
        if (!userRepository.existsByUsername("petugas@gmail.com")) {
            User petugas = new User("petugas@gmail.com", "petugas123", "PETUGAS", "Petugas Parkir");
            userRepository.save(petugas);
            System.out.println("✅ Default petugas user created (petugas@gmail.com/petugas123)");
        }
    }
}
