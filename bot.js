let keyMessage = null;


async function generateKey(){

    currentKey = createKey();

    keyTime = Date.now();

    let seconds = 900;


    const channel =
    client.channels.cache.get(CHANNEL_ID);


    if(!channel) return;



    const embed =
    new EmbedBuilder()
    .setTitle("🔑 Roblox Key")
    .setDescription(
        `\`\`\`${currentKey}\`\`\`\n\n`
        +
        `⏰ 剩余时间: 15:00`
    )
    .setColor(0x8A2BE2);



    // 第一次创建消息

    if(!keyMessage){

        keyMessage =
        await channel.send({
            embeds:[embed]
        });

    }
    else{

        // 后续只编辑原消息

        await keyMessage.edit({
            embeds:[embed]
        });

    }



    // 倒计时

    const timer =
    setInterval(async()=>{


        seconds--;


        if(seconds <= 0){

            clearInterval(timer);


            // 时间结束重新生成

            generateKey();

            return;

        }



        let min =
        Math.floor(seconds / 60);


        let sec =
        seconds % 60;



        embed.setDescription(

            `\`\`\`${currentKey}\`\`\`\n\n`
            +
            `⏰ 剩余时间: `
            +
            `${String(min).padStart(2,"0")}:`
            +
            `${String(sec).padStart(2,"0")}`

        );



        await keyMessage.edit({

            embeds:[embed]

        });



    },1000);

}
