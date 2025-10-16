package com.bathroombuddy.bathroombuddy.repository;

import com.bathroombuddy.bathroombuddy.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
}
