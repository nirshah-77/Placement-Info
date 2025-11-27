package com.nir.esd_final_project.repo;

import com.nir.esd_final_project.entity.Organisation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganisationRepo extends JpaRepository<Organisation, Long> {

    @Query(value = "SELECT o.id, o.org, o.address, s.first_name, s.last_name, s.email, s.rollno " +
            "FROM organisation o " +
            "JOIN placement p ON o.org = p.org " +
            "JOIN placement_student ps ON p.id = ps.place_id " +
            "JOIN students s ON ps.sid = s.id " +
            "ORDER BY o.org, s.first_name", nativeQuery = true)
    List<Object[]> getOrganisationStudents();
}
