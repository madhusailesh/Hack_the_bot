import {google} from "googleapis";

const auth = new google.auth.GoogleAuth({
    credentials:{
        client_email:process.env.GOOGLE_CLIENT_EMAIL,
        private_key:process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n"),
    },
    scopes:["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({version:"v4",auth});

export async function syncScoresToSheet(scores:any[]){
    const rows = scores.map((s,i)=>[
        i+1,
        s.name,
        s.regNo,
        s.userId,
        s.totalTime,
        s.timeStamp.toISOString(),
    ]);

    await sheets.spreadsheets.values.append({
        spreadsheetId:process.env.SCORE_SHEET_ID!,
        range:"Scores!A1",
        valueInputOption:"RAW",
        requestBody:{
            values:[
                ["Rank","Name","Reg_No","UserID","Total_Time","Timestamp"],
                ...rows,
            ],
        },
    });
}
