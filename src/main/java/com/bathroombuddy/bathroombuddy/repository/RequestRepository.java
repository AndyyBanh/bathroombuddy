package com.bathroombuddy.bathroombuddy.repository;

import com.bathroombuddy.bathroombuddy.model.Request;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    Page<Request> findByStatus(String status, Pageable pageable);
}
