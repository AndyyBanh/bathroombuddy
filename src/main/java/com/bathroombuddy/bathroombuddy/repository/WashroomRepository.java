package com.bathroombuddy.bathroombuddy.repository;

import com.bathroombuddy.bathroombuddy.model.Washroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WashroomRepository extends JpaRepository<Washroom, Long> {
}
