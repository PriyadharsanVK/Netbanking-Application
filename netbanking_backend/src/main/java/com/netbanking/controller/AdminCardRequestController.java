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

    /* ---------- VIEW ALL CARD REQUESTS ---------- */
    @GET
    public Response getAllRequests() {
        List<CardRequest> requests = cardRequestRepository.findAll();
        return Response.ok(requests).build();
    }

    /* ---------- APPROVE CARD ---------- */
    @POST
    @Path("/{id}/approve")
    public Response approve(@PathParam("id") Long requestId) {

        CardRequest req = cardRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Card request not found"));

        if (!"PENDING".equals(req.getStatus())) {
            throw new BadRequestException("Request already processed");
        }

        Card card = new Card();
        card.setAccount(req.getAccount());
        card.setCardType(req.getCardType());
        card.setCardNumber("CARD" + System.nanoTime());
        card.setStatus("ACTIVE");
        card.setCreatedAt(Instant.now());
        card.setExpiryDate(LocalDate.now().plusYears(5));

        cardRepository.save(card);

        req.setStatus("APPROVED");
        cardRequestRepository.save(req);

        return Response.ok("Card approved and issued").build();
    }

    /* ---------- REJECT CARD ---------- */
    @POST
    @Path("/{id}/reject")
    public Response reject(@PathParam("id") Long requestId) {

        CardRequest req = cardRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Card request not found"));

        if (!"PENDING".equals(req.getStatus())) {
            throw new BadRequestException("Request already processed");
        }

        req.setStatus("REJECTED");
        cardRequestRepository.save(req);

        return Response.ok("Card request rejected").build();
    }
}
