package com.chat_app.chat_app.Servisi;


import com.chat_app.chat_app.Modeli.Razgovor;
import com.chat_app.chat_app.Repo.RazgovorRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RazgovorService {


    private final RazgovorRepo razgovorRepo;
    private final RazgovorSobaService  razgovorSobaService;



    public Razgovor sacuvaj(Razgovor razgovor)
    {
        var razgovorID =  razgovorSobaService.getRazgovorSobaID(razgovor.getPosiljalacID(), razgovor.getPrimalacID(),
                true)
                .orElseThrow();


        razgovor.setIdRazgovora(razgovorID);

        razgovorRepo.save(razgovor);
        return razgovor;
    }


    public List<Razgovor>  pronadjiPoruke(
            String posiljalacID,
            String primilacID
    )
    {
        var idRazgovora = razgovorSobaService.getRazgovorSobaID(posiljalacID, primilacID, false);

         return idRazgovora.map(razgovorRepo :: findByIdRazgovora).orElse(new ArrayList<>());


    }





}
