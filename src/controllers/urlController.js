
const shortid = require('shortid');
const Validator = require('../Validator/valid');
const urlModels = require("../models/urlModels");
const redis = require("redis");
const { promisify } = require("util")


const redisClient = redis.createClient(
    18998,
    "redis-18998.c80.us-east-1-2.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("20s1SErw7F9z7P4ZTGMXsD83tVV26SdU", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis.......");
  });

//2. use the commands :
const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const createUrl = async function (req, res) {
    try {
        let data = req.body
        const longUrl = data.longUrl;
        const base = "http://localhost:3000"     //our server base code
        const urlCode = shortid.generate(); // generate the unique code
        // check the data are present or not 
        if (!Validator.isValidReqBody(data)) { return res.status(400).send({ status: false, msg: "Please provide data" }) }
        // required the longurl in body
        if (!Validator.isValid(longUrl)) return res.status(400).send({ status: false, msg: "Please provide long Url Link" })
        // validation  of url link
        if (Validator.validUrl(longUrl)) {
            const checkCache = await GET_ASYNC(`${longUrl}`) // find the data in cache memory
            if (checkCache) {
                let obj = JSON.parse(checkCache) //to convert JSON object
                return res.status(200).send({ status: "true", data: { longUrl: obj.longUrl, shortUrl: obj.shortUrl, urlCode: obj.urlCode,expiry:obj.expiry } })
            }
            const saveUrl = await urlModels.findOne({ longUrl: longUrl }) // check the data are present or not
            if (saveUrl) {
                return res.status(200).send({ status: true, data: { longUrl: saveUrl.longUrl, shortUrl: saveUrl.shortUrl, urlCode: saveUrl.urlCode,expiry:saveUrl.expiry } })
            }
            else {
                const shortUrl = `${base}/${urlCode}`; // merage the base url and url code in store in short url
                //taking the key and value in url object
                const url = {
                    longUrl,
                    shortUrl,
                    urlCode
                };
                const saveData = await urlModels.create(url); // create the data in url model
                // set the data in cache memory 
                await SET_ASYNC(`${longUrl}`, JSON.stringify(saveData))

                return res.status(201).send({ status: true, data: { longUrl: saveData.longUrl, shortUrl: saveData.shortUrl, urlCode: saveData.urlCode,expiry:saveData.expiry } })
            }
        }
        else {
            return res.status(400).send({ status: false, msg: "Invalid Url!!" });
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}





const urlUpdate = async (req, res)=>{
    try {
        let urlid = req.params.urlid
        let dataa = req.body
        let {long} = dataa
        // let getData = await urlMOdel.findById({_id: urlid})
        // console.log(getData)
        let data = await urlModels.findOneAndUpdate({_id: urlid},{longUrl: long},{new: true});

        return res.status(201).send({status: true, data:data})
    } catch (err) {
        console.log(err)
        return res.status(500).send({status: false, Error: err.message})
    }
}

const getUrlcode = async function (req, res) {
    try {
        let urlCode = req.params.urlCode
        //validation of the url code
        if(!shortid.isValid(urlCode)) return res.status(400).send({ status: false, message: "Url code  is not valid !!" });


        const checkCache = await GET_ASYNC(`${urlCode}`) // find the data in cache memory
        if (checkCache) {
            let obj = JSON.parse(checkCache) //convert to JSON string in JSON object
            return res.status(302).redirect(JSON.parse(obj)) // redirect the url
        }

        let getUrl = await urlModels.findOne({urlCode}) // find the url data in db by urlcode
        if (!getUrl) return res.status(404).send({ status: false, msg: "This urlcode no data exists" })

        let seturl = getUrl.longUrl
        await SET_ASYNC(`${seturl}`, JSON.stringify(getUrl)) // // set the data in cache memory 
        return res.status(302).redirect(seturl)
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
const UrlDelete = async (req,res)=>{
    try {
        let urlid = req.params.urlid

        let upadteData= await urlModels.findOneAndUpdate({_id: urlid, isDeleted: false},{isDeleted: true},{new:true})
     
        if(upadteData === null) return res.status(401).send({status:false, msg:"document with this Id dosen't exist "})
        return res.status(200).send({status: true, msg:"Deleted Sucessfull"})
    } catch (err) {
        return res.status(500).send({status: false, Error: err.message})
    }
}


module.exports = { createUrl, getUrlcode,urlUpdate,UrlDelete }
