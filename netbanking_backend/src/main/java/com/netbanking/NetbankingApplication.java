package com.netbanking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCrypt;

@SpringBootApplication
public class NetbankingApplication {

	public static void main(String[] args) {
		SpringApplication.run(NetbankingApplication.class, args);
//		String newHash = BCrypt.hashpw("prasanna123", BCrypt.gensalt(10));
//		System.out.println("Hash: " + newHash);
	}
}
