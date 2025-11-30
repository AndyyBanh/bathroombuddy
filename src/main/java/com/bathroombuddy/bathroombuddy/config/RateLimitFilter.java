package com.bathroombuddy.bathroombuddy.config;

import com.bathroombuddy.bathroombuddy.service.RateLimitService;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;


import java.io.IOException;

@Component
public class RateLimitFilter implements Filter {

    private final RateLimitService rateLimitService;

    public RateLimitFilter(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    /**
     * Applies rate limiting to POST method requests to /api/v1/request
     * Gets client ip and checks if bucket has enough tokens to consume
     * 1 request will consume 1 token
     * Considering if enough tokens to consume
     * If true pass method and move to next filter
     * If false return 429 error with message indicating how long to wait
     * @param request
     * @param response
     * @param chain
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        if (httpRequest.getRequestURI().equals("/api/v1/request") && httpRequest.getMethod().equals("POST")) {
            String ipAddress = getClientIP(httpRequest);
            Bucket bucket = rateLimitService.resolveBucket(ipAddress);

            ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

            if  (probe.isConsumed()) {
                httpResponse.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
                chain.doFilter(request, response);
            } else {
                long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
                httpResponse.setStatus(429);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"message\": \"Too many requests. Please try again in " + waitForRefill + " seconds.\"}");
            }
        } else {
            chain.doFilter(request, response);
        }
    }

    /**
     * Helper method to get clients ip address from header
     * @param httpRequest
     * @return
     */
    private String getClientIP(HttpServletRequest httpRequest) {
        String xfHeader = httpRequest.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            xfHeader = httpRequest.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
