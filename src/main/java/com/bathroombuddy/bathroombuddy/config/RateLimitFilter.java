package com.bathroombuddy.bathroombuddy.config;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.function.Supplier;


@Component
public class RateLimitFilter implements Filter {

    private final Logger logger = LoggerFactory.getLogger(RateLimitFilter.class);

    @Autowired
    @Qualifier("generalApiBucketConfig")
    Supplier<BucketConfiguration> generalApiBucketConfig;

    @Autowired
    @Qualifier("authBucketConfig")
    Supplier<BucketConfiguration> authBucketConfig;

    @Autowired
    ProxyManager<String> proxyManager;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        String uri = httpRequest.getRequestURI();
        boolean isPost = httpRequest.getMethod().equals("POST");
        boolean isApiRequest = uri.equals("/api/v1/request") && isPost;
        boolean isAuthLogin = uri.equals("/api/v1/auth/login") && isPost;

        if (isApiRequest || isAuthLogin) {
            String ip = httpRequest.getRemoteAddr();
            String key = (isAuthLogin ? "auth:" : "api:") + ip;
            Supplier<BucketConfiguration> config = isAuthLogin ? authBucketConfig : generalApiBucketConfig;
            Bucket bucket = proxyManager.builder().build(key, config);

            ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

            logger.info("Rate limit check: IP: {}, Remaining tokens: {}, Consumed: {}",
                    key, probe.getRemainingTokens(), probe.isConsumed());

            if  (probe.isConsumed()) {
                httpResponse.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
                chain.doFilter(request, response);
            } else {
                long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
                logger.warn("Rate limit exceeded - IP: {}, Retry after: {} seconds", key, waitForRefill);
                httpResponse.setStatus(429);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"message\": \"Too many requests. Please try again in " + waitForRefill + " seconds.\"}");
            }
        } else {
            chain.doFilter(request, response);
        }
    }

}
