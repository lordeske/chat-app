package com.chat_app.chat_app.Modeli;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class RazgovorSoba {


    @Id
    private String idSobe;

    private String idRazgovora;
    private String posiljalacID;
    private String primilacID;




}
