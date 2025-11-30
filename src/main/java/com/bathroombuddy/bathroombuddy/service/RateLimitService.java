package com.bathroombuddy.bathroombuddy.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {
    private final Map<String, Bucket> ipBuckets = new ConcurrentHashMap<>();

    /**
     * Method to check if ip address has bucket if not create new bucket
     * @param ipAddress
     * @return
     */
    public Bucket resolveBucket(String ipAddress) {
        return ipBuckets.computeIfAbsent(ipAddress, (ip) -> this.createNewBucket(ip));
    }

    /**
     * Method to create new bucket
     * allowing 5 requests per 5 minutes per ip address
     * by filling bucket with 5 token every 5 minutes and removing token for every request
     * @param ipAddress
     * @return
     */
    private Bucket createNewBucket(String ipAddress) {
        Bandwidth limit = Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(5)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

}
