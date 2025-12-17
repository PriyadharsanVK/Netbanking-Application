package com.netbanking.config;

import com.netbanking.controller.AccountRequestController;
import jakarta.ws.rs.ApplicationPath;
import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Configuration;

@Configuration
@ApplicationPath("/api")
public class JerseyConfig extends ResourceConfig {

    public JerseyConfig() {
        register(org.glassfish.jersey.jackson.JacksonFeature.class);
        packages("com.netbanking.controller");
        packages("com.netbanking.config");
//        register(com.netbanking.controller.AccountRequestController.class);
//        register(com.netbanking.controller.AccountController.class);
    }
}
