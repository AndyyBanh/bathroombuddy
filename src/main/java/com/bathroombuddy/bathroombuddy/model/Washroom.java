package com.bathroombuddy.bathroombuddy.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "washrooms")
@Getter
@Setter
public class Washroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String floor;

    public Washroom() {

    }

    public Washroom(String name, String floor) {
        this.name = name;
        this.floor = floor;
    }
}
