import {scores,scoreSheetOutbox} from "@/src/lib/schema";
import {syncScoresToSheet} from "@/src/lib/spreadsheet";

async function runWorker(){
    console.log("Spreadsheet Worker running...");
    while (true){
        const event = await scoreSheetOutbox.findOne(
            {processed:false},
            {sort:{createdAt:1}}
        );

        if(!event){
            await new Promise(r=>setTimeout(r,2000));
            continue;
        }

        try{
            const allScores = await scores.find({}).sort({totalTime:1}).toArray();

            await syncScoresToSheet(allScores);

            await scoreSheetOutbox.updateOne({
                _id:event._id,            
            },{$set:{processed:true}});

            console.log("Spreadsheet synced");
        }catch(e:any){
            console.error("Spreadsheet sync failed:",e);
        }
    }
}

runWorker();
