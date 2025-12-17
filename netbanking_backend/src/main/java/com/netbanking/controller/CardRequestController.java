package com.netbanking.controller;

import com.netbanking.dto.CreateCardRequest;
import com.netbanking.entity.Account;
import com.netbanking.entity.CardRequest;
import com.netbanking.repository.AccountRepository;
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
    private final AccountRepository accountRepository;

    public CardRequestController(CardRequestRepository cardRequestRepository,
                                 AccountRepository accountRepository) {
        this.cardRequestRepository = cardRequestRepository;
        this.accountRepository = accountRepository;
    }

    @POST
    public Response requestCard(CreateCardRequest request) {

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new NotFoundException("Account not found"));

        // Prevent multiple pending requests for same account + card type
        boolean alreadyPending =
                cardRequestRepository.existsByAccount_IdAndStatusAndCardType(
                        account.getId(),
                        "PENDING",
                        request.getCardType()
                );
        if (alreadyPending) {
            throw new WebApplicationException(
                    "Card request already pending for this account",
                    Response.Status.BAD_REQUEST
            );
        }

        CardRequest cardRequest = new CardRequest();
        cardRequest.setAccount(account);
        cardRequest.setCardType(request.getCardType());
        cardRequest.setStatus("PENDING");

        cardRequestRepository.save(cardRequest);

        return Response.ok("Card request submitted").build();
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
