package com.netbanking.controller;

import com.netbanking.entity.Card;
import com.netbanking.repository.CardRepository;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Path("/admin/cards")
@Produces(MediaType.APPLICATION_JSON)
public class AdminCardController {

    private final CardRepository cardRepository;

    public AdminCardController(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    /* ---------- VIEW ALL CARDS ---------- */
    @GET
    public Response getAllCards(@QueryParam("status") String status) {

        List<Card> cards;

        if (status == null || status.isBlank()) {
            cards = cardRepository.findAll();
        } else {
            cards = cardRepository.findByStatus(status.toUpperCase());
        }

        return Response.ok(cards).build();
    }

    /* ---------- BLOCK CARD ---------- */
    @POST
    @Path("/{cardId}/block")
    public Response blockCard(@PathParam("cardId") Long cardId) {

        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new NotFoundException("Card not found"));

        if (!"ACTIVE".equals(card.getStatus())) {
            throw new WebApplicationException(
                    "Only ACTIVE cards can be blocked",
                    Response.Status.BAD_REQUEST
            );
        }

        card.setStatus("BLOCKED");
        cardRepository.save(card);

        return Response.ok("Card blocked successfully").build();
    }

    /* ---------- UNBLOCK CARD ---------- */
    @POST
    @Path("/{cardId}/unblock")
    public Response unblockCard(@PathParam("cardId") Long cardId) {

        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new NotFoundException("Card not found"));

        if (!"BLOCKED".equals(card.getStatus())) {
            throw new WebApplicationException("Only BLOCKED cards can be unblocked",
                    Response.Status.BAD_REQUEST);
        }

        card.setStatus("ACTIVE");
        cardRepository.save(card);

        return Response.ok("Card unblocked successfully").build();
    }
}
