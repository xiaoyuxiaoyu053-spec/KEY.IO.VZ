const express = require("express");
const {
    Client,
    GatewayIntentBits,
    EmbedBuilder
} = require("discord.js");


const app = express();


const TOKEN = process.env.TOKEN;

const CHANNEL_ID = "1534197038391230626";



let currentKey = "";

let keyCreatedTime = 0;

let keyMessage = null;


const KEY_TIME = 900;



// =====================
// Key生成
// =====================

function createKey(){

    const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for(let i = 0; i < 50; i++){

        result += chars[
            Math.floor(
                Math.random() * chars.length
            )
        ];

    }

    return result;

}



// =====================
// Roblox验证API
// =====================

app.get("/",(req,res)=>{

    res.send(
        "Roblox Key Server Online"
    );

});



app.get("/verify",(req,res)=>{


    const key = req.query.key;


    if(!key){

        return res.json({
            success:false,
            message:"No key"
        });

    }



    if(
        (Date.now()-keyCreatedTime)/1000
        > KEY_TIME
    ){

        return res.json({
            success:false,
            message:"Key expired"
        });

    }



    if(key === currentKey){

        return res.json({
            success:true,
            message:"Key verified"
        });

    }



    res.json({

        success:false,

        message:"Wrong key"

    });


});





// =====================
// Discord Bot
// =====================


const client = new Client({

    intents:[

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMessages

    ]

});





client.once("ready",()=>{


    console.log(
        "Bot Online "
        + client.user.tag
    );


    updateKey();


});






async function updateKey(){


    currentKey = createKey();


    keyCreatedTime = Date.now();



    const channel =
    client.channels.cache.get(
        CHANNEL_ID
    );


    if(!channel){

        console.log(
            "频道不存在"
        );

        return;

    }




    let seconds = 900;




    const embed =
    new EmbedBuilder()

    .setTitle(
        "🔑 小星游戏密钥"
    )

    .setDescription(

        "```\n"
        +
        currentKey
        +
        "\n```\n\n"
        +
        "⏰ 剩余时间: 15:00"

    )

    .setColor(
        0x8A2BE2
    );





    if(!keyMessage){


        keyMessage =
        await channel.send({

            embeds:[
                embed
            ]

        });


    }else{


        await keyMessage.edit({

            embeds:[
                embed
            ]

        });


    }






    while(seconds > 0){


        await new Promise(
            resolve =>
            setTimeout(resolve,1000)
        );


        seconds--;



        let min =
        Math.floor(seconds / 60);



        let sec =
        seconds % 60;



        embed.setDescription(

            "```\n"
            +
            currentKey
            +
            "\n```\n\n"
            +

            "⏰ 剩余时间: "

            +

            String(min)
            .padStart(2,"0")

            +

            ":"

            +

            String(sec)
            .padStart(2,"0")

        );




        await keyMessage.edit({

            embeds:[
                embed
            ]

        });



    }




    // 重新生成

    updateKey();


}





// =====================
// 启动网页
// =====================

app.listen(

    process.env.PORT || 10000,

    ()=>{

        console.log(
            "Web Online"
        );

    }

);



// 登录

client.login(TOKEN);
