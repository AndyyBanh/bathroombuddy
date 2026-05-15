package com.bathroombuddy.bathroombuddy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class BathroombuddyApplication {

	public static void main(String[] args) {
		SpringApplication.run(BathroombuddyApplication.class, args);
	}

}
