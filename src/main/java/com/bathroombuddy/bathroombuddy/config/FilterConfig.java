package com.bathroombuddy.bathroombuddy.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    /**
     * Register rateLimitFilter as servlet filet in spring context
     * @param filter
     * @return
     */
    @Bean
    public FilterRegistrationBean<RateLimitFilter> rateLimitFilters(RateLimitFilter filter) {
        FilterRegistrationBean<RateLimitFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(filter);
        registrationBean.addUrlPatterns("/api/v1/request", "/api/v1/auth/login");
        registrationBean.setOrder(1);
        return registrationBean;
    }
}