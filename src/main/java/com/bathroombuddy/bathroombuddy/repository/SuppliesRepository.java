package com.bathroombuddy.bathroombuddy.repository;

import com.bathroombuddy.bathroombuddy.model.Supplies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SuppliesRepository extends JpaRepository<Supplies,Long> {
}
