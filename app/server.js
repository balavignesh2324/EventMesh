const express = require('express')
const app = express();
const xenv = require('@sap/xsenv');
const hdbext = require('@sap/hdbext');
// const axios = require('axios');

//get HANA Cloud info with credentials
let hanasrv = xenv.getServices({ hana: { tag: 'hana' } });
let msgsrv = xenv.getServices({ "enterprise-messaging": { tag: 'enterprise-messaging' } });
// let uaa = xenv.getServices({"xsuaa": {tag: 'xsuaa'} });



app.use(hdbext.middleware(hanasrv.hana));

app.use(express.json())
app.listen(process.env.PORT,  () => { console.log('===> Server started') })

app.post('/webhook', (req, res) => {
    try{
    let element = req.body;
    var hanaConfig = xenv.cfServiceCredentials({ tag: 'hana' });
    console.log("hana configurations " + hanaConfig.toString());
    hdbext.createConnection(hanaConfig, function(error, client) {
        if(error) {
            return console.error("error while creating connection :" + error);
        }  
         client.exec('INSERT INTO "COMAUCLOIL"."SAP_COM_COMAU_ENTITIES_CHECKLISTINSTANCES" VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
         [element.PLANT,"","",123,"","","","","","",1,2,"",3,"","","","",4,"",5,"",6,"","",
            "","","","","","","","","","","","","","","","","","","","","","",""],
             (err) => {
                if (err) {
                    console.log("error on insert:" + err);
                }
             });
        });
    console.log(`===> [/webhook/hookorcrook] Received message with payload: ${element.PLANT}, ${element.ROWTYPE}`)
    res.send('Data Upload successful');
    } catch(err){
        console.log("error from bigger scope :" + err.message)
    }
})