package com.netbanking.controller;

import com.netbanking.dto.CardResponse;
import com.netbanking.repository.CardRepository;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Path("/cards")
@Produces(MediaType.APPLICATION_JSON)
public class CardController {

    private final CardRepository cardRepository;

    public CardController(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    /* ---------- GET CARDS BY ACCOUNT ---------- */
    @GET
    @Path("/account/{accountId}")
    public Response getAccountCards(@PathParam("accountId") Long accountId) {

        List<CardResponse> cards = cardRepository.findByAccount_Id(accountId)
                .stream()
                .map(c -> new CardResponse(
                        c.getId(),
                        maskCardNumber(c.getCardNumber()),
                        c.getCardType(),
                        c.getStatus(),
                        c.getExpiryDate()
                ))
                .toList();

        return Response.ok(cards).build();
    }

    private String maskCardNumber(String number) {
        return "XXXX-XXXX-" + number.substring(number.length() - 4);
    }
}
