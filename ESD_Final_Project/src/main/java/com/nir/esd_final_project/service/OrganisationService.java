package com.nir.esd_final_project.service;

import com.nir.esd_final_project.repo.OrganisationRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganisationService {
    private final OrganisationRepo organisationRepo;

    public OrganisationService(OrganisationRepo organisationRepo) {
        this.organisationRepo = organisationRepo;
    }

    public List<Object[]> getOrganisationStudents() {
        return organisationRepo.getOrganisationStudents();
    }
}
