package com.plethora.tpo.service;

import com.plethora.tpo.entity.Notification;
import com.plethora.tpo.entity.User;
import com.plethora.tpo.exception.ResourceNotFoundException;
import com.plethora.tpo.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void notify(User user, String type, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .build();
        notificationRepository.save(notification);
    }

    public List<Notification> findForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markRead(Long notificationId, Long requestingUserId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getUser().getId().equals(requestingUserId)) {
            throw new ResourceNotFoundException("Notification not found");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
