package com.chat_app.chat_app.Modeli;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Builder
@Document
public class Razgovor {

        @Id
        private String id;
        private String idRazgovora;
        private String primalacID;
        private String posiljalacID;
        private String poruka;
        private Date  datum;



}
