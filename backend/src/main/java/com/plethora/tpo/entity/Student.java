package com.plethora.tpo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String rollNumber;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private Double cgpa;

    @Column(nullable = false)
    private Integer graduationYear;

    private String phone;

    private String resumeUrl;

    private Integer backlogs;

    @Column(length = 1000)
    private String skills;
}
