package com.internmatch.config;

import com.internmatch.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseVerificationRunner implements ApplicationRunner {

    private final UserRepository userRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("Starting database verification (ApplicationRunner)...");

        try {
            long count = userRepository.count();
            log.info("Database OK - {} users found", count);
        } catch (Exception e) {
            log.error("Database verification failed!", e);
        }
    }
}