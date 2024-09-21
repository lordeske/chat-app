package com.chat_app.chat_app.Modeli;


import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document
public class Korisnik {

    @Id
    private String korisnickoIme;
    private String imeIPrezime;
    private Status status;






}
