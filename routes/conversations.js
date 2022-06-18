const router = require("express").Router();
const Conversation = require("../models/Conversation");
const axios = require('axios');




// new conversation


router.post("/" ,async (req , res) => {
    console.log(req.headers.authorization);
    const url='http://localhost:8081/api/verify?token=' + req.headers.authorization;
    let response = await axios.get(url);

    let data = response.data;
    
    if (data.message == "Unvalid"){
        res.json(data);
    }
    else{
        const receiverId = req.body.receiverId;
        const conversations = await Conversation.find({
            members: { $in: [[data.userid , receiverId]]}, 
        });
        if(conversations.length != 0){
            console.log("i have a conversation with u");
            console.log(conversations);
            res.json(conversations[0]);
            return;
        } 
        const newConversation = new Conversation({
            members: [data.userid , req.body.receiverId],
        });
    
        try{
            const savedConversation = await newConversation.save();
            res.status(200).json(savedConversation)
        }
        catch(err){
            res.status(500).json(err)
        }

    }
});

router.get("/" ,async (req , res) => {
    console.log(req.headers.authorization);
    const url='http://localhost:8081/api/verify?token=' + req.headers.authorization;
    

    var response = await axios.get(url);

    var data = response.data;
    
    if (data.message == "Unvalid"){
        res.json(data);
    }
    else{

    
        try{
            const conversations = await Conversation.find({
                members: { $in: [data.userid]}, 
            });

            var userid = data.userid;
            
            var convs = [];

            await Promise.all(conversations.map(async (conversation) => {
                console.log(conversation.members.find(function(member){
                    return member != userid;
                }));
                let url2 = 'http://localhost:8081/api/getName?userid=' + conversation.members.find(function(member){
                    return member != userid;
                });
                let response2 = await axios.get(url2);
                let data = response2.data;
                var conv = conversation.toObject();
                console.log(data.name);
                conv.name = data.name;
                //conv.name = "data.name";
                convs.push(conv);
                console.log(convs);
            }));
            
            /*conversations.forEach(async (conversation) => {
                console.log(conversation.members.find(function(member){
                    return member != userid;
                }));
                let url2 = 'http://localhost:8081/api/getName?userid=' + conversation.members.find(function(member){
                    return member != userid;
                });
                let response2 = await axios.get(url2);
                let data = response2.data;
                var conv = conversation.toObject();
                console.log(data.name);
                //conv.name = data.name;
                conv.name = "data.name";
                convs.push(conv);
                console.log(convs);
            });*/      
            console.log(convs);
            res.status(200).json(convs);        
            //console.log(convs);
            
        }
        catch(err){
            res.status(500).json(err)
        }

    }
});

//get conv of user

module.exports = router;