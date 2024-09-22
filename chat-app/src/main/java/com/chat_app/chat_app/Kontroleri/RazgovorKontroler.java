package com.chat_app.chat_app.Kontroleri;


import com.chat_app.chat_app.Modeli.PorukaNotif;
import com.chat_app.chat_app.Modeli.Razgovor;
import com.chat_app.chat_app.Servisi.RazgovorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
@RequiredArgsConstructor

public class RazgovorKontroler {


    private final RazgovorService razgovorService;
    private final SimpMessagingTemplate chat;


    @GetMapping(path = "/poruke/{posiljalacID}/{primalacID}")
    public ResponseEntity<List<Razgovor>> prikaziPoruke(
            @PathVariable ("posiljalacID") String posiljalacID,
            @PathVariable ("primalacID")  String primalacID
    )
    {

       return ResponseEntity.ok(razgovorService.pronadjiPoruke(posiljalacID, primalacID));



    }



    @MessageMapping("razgovor")
    private void   processPoruku(
            @Payload Razgovor razgovor
    )
    {

        Razgovor sacuvanaPoruka = razgovorService.sacuvaj(razgovor);
        chat.convertAndSendToUser(
                razgovor.getPrimalacID(),"/queue/poruke", PorukaNotif.builder()
                        .id(sacuvanaPoruka.getId())
                        .posiljalacID(sacuvanaPoruka.getPosiljalacID())
                        .primalacID(sacuvanaPoruka.getPrimalacID())
                        .poruka(sacuvanaPoruka.getPoruka())
        );




    }




}
