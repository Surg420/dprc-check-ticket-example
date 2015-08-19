/**
 * Created by surgeon on 18.08.2015.
 */

/// <reference path='typings/tsd.d.ts' />

import winston = require("winston");
import tickets = require("./tickets");

var
    log = new winston.Logger({
        transports : [
            new winston.transports.Console({
                colorize:   true,
                level:      'debug'
            })
        ]
    });

function checkAlert(input:tickets.TicketInfo[]){
    var res = input.filter( (t)=> t.seats.filter( (s)=> s.type == tickets.SeatType.coupe || s.type == tickets.SeatType.lowCost ).length > 0 );
    if (res.length > 0){
        log.warn("!!!!!!!!!!!!!!!!!!!!11");
        log.warn("!!!! NEW TRAIN !!!!!");

        res.forEach((t)=> log.warn(t.toString() ) );

        log.warn("!!!!!!!!!!!!!!!!!!!!11");
    }
}

function showTickets(){
    tickets.getTickets("22208001","22200001","2015-08-25").then((downloadedTickets:tickets.TicketInfo[])=>{
        console.log("");
        log.info("========================");
        log.info("Check at: " + (new Date()).toLocaleTimeString() );

        checkAlert(downloadedTickets.filter((t)=>t.departure.getHours() > 15 ));

        downloadedTickets.forEach((t:tickets.TicketInfo)=>{
            log.info(t.toString());
        });
        log.info("========================");
        console.log("");
    });

    tickets.getTickets("22208001","22200001","2015-08-26").then((downloadedTickets:tickets.TicketInfo[])=>{
        console.log("");
        log.info("========================");
        log.info("Check at: " + (new Date()).toLocaleTimeString());

        checkAlert(downloadedTickets.filter((t)=>t.departure.getHours() < 3 ));

        downloadedTickets.forEach((t:tickets.TicketInfo)=>{
            log.info(t.toString());
        });
        log.info("========================");
        console.log("");
    });
}

showTickets();

setInterval(()=>{
    showTickets();
}, 60*1000);
