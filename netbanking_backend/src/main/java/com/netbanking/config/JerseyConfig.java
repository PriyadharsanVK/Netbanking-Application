package com.netbanking.config;

import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JerseyConfig extends ResourceConfig {

    public JerseyConfig() {
        register(org.glassfish.jersey.jackson.JacksonFeature.class);
        packages("com.netbanking.controller");
        packages("com.netbanking.config");
//        register(com.netbanking.controller.AccountController.class);
    }
}
