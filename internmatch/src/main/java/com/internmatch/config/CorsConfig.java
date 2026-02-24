package com.internmatch.config;  // or wherever your config classes are

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:3000",   // ← your current frontend port
                        "http://localhost:5173",   // ← previous one (Vite?)
                        "http://localhost:4200"    // ← Angular if you use it
                        // Add production URL later: "https://your-app.vercel.app"
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD")
                .allowedHeaders("*")           // very important for Authorization, Content-Type, etc.
                .allowCredentials(true)        // keep if you need cookies or auth headers
                .maxAge(3600);                 // cache preflight response for 1 hour
    }
}