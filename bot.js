const express = require("express");
const {
    Client,
    GatewayIntentBits,
    EmbedBuilder
} = require("discord.js");

const app = express();


const TOKEN = process.env.TOKEN;

const CHANNEL_ID = "1534197038391230626";


// 当前Key

let currentKey = "";

let keyCreatedTime = 0;


// 15分钟

const KEY_TIME = 900;



// 保存Discord消息

let keyMessage = null;



// =====================
// 生成Key
// =====================

function createKey(){

    const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


    let key = "";


    for(let i = 0; i < 50; i++){

        key += chars[
            Math.floor(
                Math.random() * chars.length
            )
        ];

    }


    return key;

}



// =====================
// Roblox API
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



    const expired =
    (Date.now()-keyCreatedTime)/1000
    > KEY_TIME;



    if(expired){

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




    return res.json({

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
        "Bot Online: "
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
            "找不到频道"
        );

        return;

    }



    let seconds = 900;




    const embed =
    new EmbedBuilder()

    .setTitle(
        "🔑 Roblox Key"
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





    const timer =
    setInterval(async()=>{


        seconds--;



        if(seconds <= 0){


            clearInterval(timer);


            updateKey();


            return;

        }




        const min =
        Math.floor(seconds / 60);



        const sec =
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
            String(min).padStart(2,"0")
            +
            ":"
            +
            String(sec).padStart(2,"0")

        );




        await keyMessage.edit({

            embeds:[
                embed
            ]

        });



    },1000);


}





// =====================
// 启动Web
// =====================


app.listen(

    process.env.PORT || 10000,

    ()=>{

        console.log(
            "Web Server Online"
        );

    }

);



// 登录Discord

client.login(TOKEN);
