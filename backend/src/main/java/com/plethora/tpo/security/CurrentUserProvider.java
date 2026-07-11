package com.plethora.tpo.security;

import com.plethora.tpo.entity.User;
import com.plethora.tpo.exception.ResourceNotFoundException;
import com.plethora.tpo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    private final UserRepository userRepository;

    public User resolve(UserPrincipal principal) {
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }
}
