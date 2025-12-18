package com.netbanking.controller;

import com.netbanking.entity.Card;
import com.netbanking.entity.CardRequest;
import com.netbanking.repository.CardRepository;
import com.netbanking.repository.CardRequestRepository;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Component
@Path("/admin/card-requests")
@Produces(MediaType.APPLICATION_JSON)
public class AdminCardRequestController {

    private final CardRequestRepository cardRequestRepository;
    private final CardRepository cardRepository;

    public AdminCardRequestController(CardRequestRepository cardRequestRepository,
                                      CardRepository cardRepository) {
        this.cardRequestRepository = cardRequestRepository;
        this.cardRepository = cardRepository;
    }

    /* ---------- VIEW CARD REQUESTS (OPTIONAL FILTER) ---------- */
    @GET
    public Response getRequests(@QueryParam("status") String status) {

        List<CardRequest> requests;

        if (status == null || status.isBlank()) {
            requests = cardRequestRepository.findAll();
        } else {
            requests = cardRequestRepository.findByStatus(status.toUpperCase());
        }

        return Response.ok(requests).build();
    }

    /* ---------- APPROVE CARD ---------- */
    @POST
    @Path("/{id}/approve")
    public Response approve(@PathParam("id") Long requestId) {

        CardRequest request = cardRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Card request not found"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new WebApplicationException(
                    "Request already processed",
                    Response.Status.BAD_REQUEST
            );
        }

        String cardType = request.getCardType();
        Long accountId = request.getAccount().getId();

        boolean activeExists =
                cardRepository.existsByAccount_IdAndCardTypeAndStatus(
                        accountId,
                        cardType,
                        "ACTIVE"
                );

        if (activeExists) {
            throw new WebApplicationException(
                    "Active " + cardType + " card already exists",
                    Response.Status.BAD_REQUEST
            );
        }

        Card card = new Card();
        card.setAccount(request.getAccount());
        card.setCardType(cardType);
        card.setCardNumber(generateCardNumber(cardType));
        card.setStatus("ACTIVE");
        card.setExpiryDate(LocalDate.now().plusYears(5));
        card.setCreatedAt(Instant.now());

        cardRepository.save(card);

        request.setStatus("APPROVED");
        cardRequestRepository.save(request);

        return Response.ok("Card approved and issued").build();
    }

    /* ---------- REJECT CARD ---------- */
    @POST
    @Path("/{id}/reject")
    public Response reject(@PathParam("id") Long requestId) {

        CardRequest request = cardRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Card request not found"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new WebApplicationException(
                    "Request already processed",
                    Response.Status.BAD_REQUEST
            );
        }

        request.setStatus("REJECTED");
        cardRequestRepository.save(request);

        return Response.ok("Card request rejected").build();
    }

    /* ---------- HELPERS ---------- */
    private String generateCardNumber(String type) {
        return (type.equals("DEBIT") ? "D-" : "C-") + System.currentTimeMillis();
    }
}
