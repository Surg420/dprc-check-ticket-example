/**
 * Created by surgeon on 19.05.2015.
 */

/// <reference path="typings/tsd.d.ts" />

import cheerio = require("cheerio");
import request = require("request");
import q = require("q");

export function downloadUrl(url:string, requestOptions?:request.Options):q.Promise<any> {
    var prom = q.Promise<CheerioStatic>((resolve, reject) => {

        request(url, requestOptions, (error:any, response:any, body:any) => {
            if (!error && response.statusCode == 200) {
                resolve(body);
                return;
            }

            reject({error: error, code: response.statusCode});

        });

    });

    return prom;
}

export function downloadJSON(url:string, requestOptions?:request.Options):q.Promise<any> {

    var prom = q.Promise<CheerioStatic>((resolve, reject) => {
        downloadUrl(url, requestOptions)
            .then((data)=> {
                var result = JSON.parse(data);
                resolve(result);
                return;
            },
            (err)=> {
                reject(err);
            });
    });

    return prom;
}

export function downloadHtml(url:string, requestOptions?:request.Options):q.Promise<CheerioStatic> {
    return q.Promise<CheerioStatic>((resolve, reject) => {
        downloadUrl(url, requestOptions)
            .then((data)=> {
                var result = cheerio.load(data);
                resolve(result);
                return;
            })
            .catch((err)=>reject(err));
    });
}

export function getGoogleTextSearch(query:string):q.Promise<any> {
    var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="
        + encodeURIComponent(query) +
        "&types=transit_station|train_station|locality&language=uk&key=AIzaSyAG8Ck8NmCYgiCgOu_JhEuUY2w7hSSK5qQ";

    return downloadJSON(url);

}

export function parseTime(time:string):Date {
    var q= time.trim().split(":"),
        res = new Date();

    if (q.length !=2) return;

    res.setHours(parseInt(q[0]), parseInt(q[1]),0,0 );
    return res;
}

function testJSON() {
    downloadJSON("http://dimon:83/Buildings?vuzId=99999").then((data)=> {
        console.log(data);
    }).catch(
        (err)=>console.log("testJSON ERROR: " + err.code)
    );
}

