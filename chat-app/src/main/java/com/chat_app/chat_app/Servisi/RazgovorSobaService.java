package com.chat_app.chat_app.Servisi;

import com.chat_app.chat_app.Modeli.RazgovorSoba;
import com.chat_app.chat_app.Repo.RazgovorSobaRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RazgovorSobaService  {

    private static RazgovorSobaRepo razgovorSobaRepo;



    public Optional<String> getRazgovorSobaID(
            String posiljalacID, String primilacID,
            boolean kreirajNovuAkoNePostoji
    ) {
        return razgovorSobaRepo.findByPrimilacIDAndPosiljalacID(posiljalacID, primilacID)
                .map(RazgovorSoba::getIdRazgovora)
                .or(() -> {
                    if (kreirajNovuAkoNePostoji) {

                        var razgovorSoba = kreirajSobu(posiljalacID,primilacID)

                    }
                    return Optional.empty();
                });
    }








    /// kreiranje razogvor sobe u formatu posiiljalac_prilamac mihajlo_marko
    public String kreirajSobu(String posiljalacID, String primilacID)
    {
        var chatID = String.format("%s_%s",posiljalacID,primilacID);
        RazgovorSoba posiljalacRecp = RazgovorSoba.builder()
                .idRazgovora(chatID)
                .posiljalacID(posiljalacID)
                .primilacID(primilacID)
                .build();

    }




}
