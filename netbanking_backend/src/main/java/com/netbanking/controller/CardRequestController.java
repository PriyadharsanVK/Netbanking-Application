package com.netbanking.controller;

import com.netbanking.dto.CreateCardRequest;
import com.netbanking.entity.Account;
import com.netbanking.entity.CardRequest;
import com.netbanking.repository.AccountRepository;
import com.netbanking.repository.CardRepository;
import com.netbanking.repository.CardRequestRepository;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Path("/card-requests")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CardRequestController {

    private final CardRequestRepository cardRequestRepository;
    private final CardRepository cardRepository;
    private final AccountRepository accountRepository;

    public CardRequestController(CardRequestRepository cardRequestRepository, CardRepository cardRepository,
                                 AccountRepository accountRepository) {
        this.cardRequestRepository = cardRequestRepository;
        this.cardRepository = cardRepository;
        this.accountRepository = accountRepository;
    }

    @POST
    public Response requestCard(CreateCardRequest request) {

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new NotFoundException("Account not found"));

        String cardType = request.getCardType().toUpperCase();

        /* 1️⃣ ACTIVE CARD CHECK */
        boolean hasActiveCard =
                cardRepository.existsByAccount_IdAndCardTypeAndStatus(
                        account.getId(),
                        cardType,
                        "ACTIVE"
                );

        if (hasActiveCard) {
            throw new WebApplicationException(
                    "You already have an active " + cardType + " card",
                    Response.Status.BAD_REQUEST
            );
        }

        /* 2️⃣ PENDING REQUEST CHECK */
        boolean hasPendingRequest =
                cardRequestRepository.existsByAccount_IdAndCardTypeAndStatus(
                        account.getId(),
                        cardType,
                        "PENDING"
                );

        if (hasPendingRequest) {
            throw new WebApplicationException(
                    "A " + cardType + " card request is already pending",
                    Response.Status.BAD_REQUEST
            );
        }

        /* 3️⃣ CREATE REQUEST */
        CardRequest cardRequest = new CardRequest();
        cardRequest.setAccount(account);
        cardRequest.setCardType(cardType);
        cardRequest.setStatus("PENDING");

        cardRequestRepository.save(cardRequest);

        return Response.ok("Card request submitted successfully").build();
    }

    /* ---------- GET ACCOUNT CARD REQUESTS ---------- */
    @GET
    @Path("/account/{accountId}")
    public Response getAccountCardRequests(
            @PathParam("accountId") Long accountId
    ) {
        List<CardRequest> requests =
                cardRequestRepository.findByAccount_Id(accountId);

        return Response.ok(requests).build();
    }
}
