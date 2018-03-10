const request = require('request');
const cheerio = require('cheerio');


const Cookie = 'ASP.NET_SessionId=islmu1rqf4jj0amaqwekpytb; britcouncil=!JvyFUliLceROduH1ZfAb+F9ii5InoeNgMCa1LdpDxnSMmOpP28cBgCcNi38WvH15ijUE1lfX83B7Zv/w0ugPv4i34z+2TFfYoobZjcw=; rxVisitor=1519815634064HA7D7I20HIUN9UI8VLT6F9KNOI4JKP0H; _ga=GA1.3.1113381858.1519815618; _gid=GA1.3.1406279692.1519815618; __utmc=15783086; __utmz=15783086.1519815643.1.1.utmcsr=britishcouncil.org.il|utmccn=(referral)|utmcmd=referral|utmcct=/exam/ielts/dates-fees-locations; dtLatC=1; __utma=15783086.1113381858.1519815618.1519823547.1519839332.4; __utmt=1; _dc_gtm_UA-25146058-2=1; __utmv=15783086.|1=country=Israel=1^2=organisation=British%20Council=1; _dc_gtm_UA-36888821-1=1; __utmb=15783086.3.10.1519839332; dtPC=4$39361849_941h-vFRABIOUCHLDIEPMEVRNXEBBKJPIPLPOKXC; rxvt=1519841165957|1519839331319; WT_FPC=id=7c87c67d-266d-4d8c-b8f4-0d9e59419716:lv=1519832165975:ss=1519832131956; dtCookie=4$180EE14B0A2F95DAFF720A899BB66AF1|ielts.britishcouncil.org|1; dtSa=true%7CKU91%7C-1%7CPage%3A%20CheckAvailability.aspx%7C-%7C1519839366704%7C39361849_941%7Chttps%3A%2F%2Fielts.britishcouncil.org%2FCheckAvailability.aspx%7CBritish%20Council%20IELTS%20Online%20Application%7C1519839365959%7C';
function IeltsTester(i) {
    return new Promise ((resolve, reject) => {
        const j = request.jar();
        const cookie = request.cookie(Cookie);
        const url = 'https://ielts.britishcouncil.org/CheckAvailability.aspx';
        j.setCookie(cookie, url);
        request({url: url, jar: j}, function (error, response, body) {
            if (error) {
                reject();
            }
            try {
                const index = parseInt(i);
                const $ = cheerio.load(body)
                const exams = $('.pnlBodyDetailRowBox');
                const june = $(exams[index]);
                const status =  june.find('.pnlBodyDetailRowBoxLeft')[3];
                let v =  $(status).html()
                console.log(v);
                resolve(v.indexOf('Full') === -1)    
            } catch(err) {
                reject(err);
            }
        })    
    })


}

let status;

module.exports = function(number, sendCallback) {
    if (!sendCallback) {
        return;
    }
    IeltsTester(number).then(
        (res) => {
            if (status !== res) {
                status = res;
                sendCallback(`The registration ${res ? '' : 'un'}available right now, I will let you know if anything changes`);
            }
        },
        () => {
            sendCallback('Sorry I am a stupid bot, plese try again');
        })
}
