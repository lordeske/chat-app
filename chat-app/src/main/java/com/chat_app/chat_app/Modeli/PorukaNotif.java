package com.chat_app.chat_app.Modeli;


import lombok.*;
import org.springframework.data.annotation.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PorukaNotif {


    private String id;
    private String posiljalacID;
    private String primalacID;
    private String poruka;






}
