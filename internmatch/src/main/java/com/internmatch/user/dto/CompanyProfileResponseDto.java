package com.internmatch.user.dto;

import lombok.Data;

@Data
public class CompanyProfileResponseDto {

    private Long id;
    private Long userId;
    private String companyName;
    private String industry;
    private String website;
    private String description;
    private String companySize;
    private String location;
    private String email;          // from User - convenient for frontend
    private String fullName;       // from User - owner name
    // add createdAt / updatedAt if you want
}