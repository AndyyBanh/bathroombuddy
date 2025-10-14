package com.bathroombuddy.bathroombuddy.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "supplies")
@Getter
@Setter
public class Supplies {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Cannot have 2 of same type of supply
    @Column(nullable = false, unique = true)
    private String type;
    @Column(nullable = false)
    private long quantity;
    @Column(name = "lastReplenished")
    private LocalDateTime lastReplenished;

    public Supplies() {

    }

    public Supplies(String type, long quantity, LocalDateTime lastReplenished) {
        this.type = type;
        this.quantity = quantity;
        this.lastReplenished = lastReplenished;
    }

}
