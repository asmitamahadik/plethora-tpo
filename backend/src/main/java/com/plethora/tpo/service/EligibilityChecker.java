package com.plethora.tpo.service;

import com.plethora.tpo.entity.PlacementDrive;
import com.plethora.tpo.entity.Student;

final class EligibilityChecker {

    private EligibilityChecker() {
    }

    static boolean isEligible(Student student, PlacementDrive drive) {
        boolean cgpaOk = student.getCgpa() != null && student.getCgpa() >= drive.getMinCgpa();
        boolean backlogsOk = student.getBacklogs() == null
                || drive.getMaxBacklogs() == null
                || student.getBacklogs() <= drive.getMaxBacklogs();
        boolean departmentOk = "ALL".equalsIgnoreCase(drive.getAllowedDepartments())
                || java.util.Arrays.stream(drive.getAllowedDepartments().split(","))
                        .map(String::trim)
                        .anyMatch(dept -> dept.equalsIgnoreCase(student.getDepartment()));
        return cgpaOk && backlogsOk && departmentOk;
    }
}
