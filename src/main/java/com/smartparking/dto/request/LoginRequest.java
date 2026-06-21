package com.smartparking.dto.request;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Username tidak boleh kosong")
    @jakarta.validation.constraints.Pattern(regexp = ".*@gmail\\.com$", message = "Format username harus @gmail.com")
    private String username;

    @NotBlank(message = "Password tidak boleh kosong")
    @jakarta.validation.constraints.Size(min = 7, message = "Password harus lebih dari 6 karakter")
    private String password;

    public LoginRequest() {}

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
