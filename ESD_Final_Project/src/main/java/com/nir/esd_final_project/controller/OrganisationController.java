package com.nir.esd_final_project.controller;

import com.nir.esd_final_project.service.OrganisationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/organisation")
public class OrganisationController {
    private final OrganisationService organisationService;

    public OrganisationController(OrganisationService organisationService) {
        this.organisationService = organisationService;
    }

    @GetMapping("/students")
    public ResponseEntity<List<Object[]>> getOrganisationStudents() {
        return ResponseEntity.ok(organisationService.getOrganisationStudents());
    }
}
