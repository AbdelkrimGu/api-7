const router = require("express").Router();
const Message = require("../models/Message");
const axios = require('axios');


//add

router.post("/" ,async (req , res) => {
    console.log(req.headers.authorization);
    const url='http://localhost:8081/api/verify?token=' + req.headers.authorization;

    let response = await axios.get(url);

    let data = response.data;
    
    if (data.message == "Unvalid"){
        res.json(data);
    }
    else{
        const newMessage = new Message({
            conversationId: req.body.conversationId,
            sender: data.userid,
            text : req.body.text
        });
    
        try{
            const savedMessage = await newMessage.save();
            res.status(200).json(savedMessage)
        }
        catch(err){
            res.status(500).json(err)
        }

    }
});

//get




router.get("/:conversationId" ,async (req , res) => {
    console.log(req.headers.authorization);
    const url='http://localhost:8081/api/verify?token=' + req.headers.authorization ;
    

    let response = await axios.get(url);

    let data = response.data;
    
    if (data.message == "Unvalid"){
        res.json(data);
    }
    else{
    
        try{
            const messages = await Message.find({
                conversationId: req.params.conversationId, 
            });
            res.status(200).json(messages);
        }
        catch(err){
            res.status(500).json(err)
        }

    }
});


module.exports = router;