package com.plethora.tpo.controller;

import com.plethora.tpo.dto.notification.NotificationResponse;
import com.plethora.tpo.entity.Notification;
import com.plethora.tpo.security.UserPrincipal;
import com.plethora.tpo.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public List<NotificationResponse> myNotifications(@AuthenticationPrincipal UserPrincipal principal) {
        return notificationService.findForUser(principal.getId()).stream().map(this::toResponse).toList();
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public void markRead(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        notificationService.markRead(id, principal.getId());
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
