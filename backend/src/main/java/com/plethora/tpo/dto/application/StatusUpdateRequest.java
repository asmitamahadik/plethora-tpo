package com.plethora.tpo.dto.application;

import com.plethora.tpo.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {

    @NotNull
    private ApplicationStatus status;

    private String remarks;
}
