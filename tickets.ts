/**
 * Created by surgeon on 18.08.2015.
 */

/// <reference path='typings/tsd.d.ts' />

import q = require("q");
import utils = require("./utils");

export enum SeatType {lux,coupe,lowCost,sitting}

export class SeatInfo{
    public cost:string;
    public left:number;
    public type:SeatType;

    static getSeatTypeString(seatType: SeatType){
        switch (seatType){
            case SeatType.coupe: return "coupe";
            case SeatType.lowCost: return "lowCost";
            case SeatType.lux: return "lux";
            case SeatType.sitting: return "sitting";
            default : return "unknown";
        }
    }

    public toString(){
        return SeatInfo.getSeatTypeString(this.type) + "-" +this.left;
    }
}

export class TicketInfo{
    trainNumber:string;
    arrive:Date;
    departure:Date;
    onway:string;
    seats:SeatInfo[];

    public toString(){
        return this.trainNumber+ " " +
            this.departure.toLocaleTimeString() + " - " +
            this.arrive.toLocaleTimeString() + " " +
            this.seats.reduce((r,i)=>r+i.toString()+" ","");
    }
}

export function getTickets(fromStation:string,toStation:string,whenDate:string): q.Promise<any>{
    return utils
        .downloadHtml("http://dprc.gov.ua/show.php?transport_type=2&src="+fromStation+"&dst="+toStation+"&dt="+whenDate+"&ps=ec_privat")
        .then(($page:CheerioStatic)=>{

            var res =<TicketInfo[]>[];

            $page("#trip_list tr.train_row").each((i:number, el:CheerioElement)=>{
                var train = new TicketInfo(),
                    addSeatInfo = (className:string,seatType:SeatType)=>{
                        var seatTd = $page(el).find("td." + className),
                            price = seatTd.find("p.price"),
                            sts = seatTd.find("span.sts"),
                            seatInfo = new SeatInfo();
                        if (price.length == 0) return;

                        seatInfo.cost = price.text().replace(/\D/g,"");
                        seatInfo.type = seatType;
                        seatInfo.left = parseInt( sts.text().replace(/\D/g,"") );
                        train.seats.push(seatInfo);
                    };

                train.trainNumber = $page(el).find("td.first").text();
                train.departure = utils.parseTime( $page(el).find("td.depart").text() );
                train.arrive = utils.parseTime( $page(el).find("td.arrive").text() );
                train.onway = $page(el).find("td.onway").text();
                train.seats = [];

                addSeatInfo("c_1050",SeatType.lux);
                addSeatInfo("c_1040",SeatType.coupe);
                addSeatInfo("c_1030",SeatType.coupe);
                addSeatInfo("c_1025",SeatType.lowCost);
                addSeatInfo("c_1020",SeatType.lowCost);
                addSeatInfo("c_1001",SeatType.sitting);

                res.push(train);
            });

            return res;
        });
}

