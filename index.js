var gplay = require('google-play-scraper');
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";
const DB_NAME = "droom"
const COLLECTION_NAME = "reviews"
let nextToken = null

const getReviews = async () => {
    var token = nextToken;
    var reviews = await gplay.reviews({
        appId: 'droom.sleepIfUCan',
        sort: gplay.sort.NEWEST,
        paginate: false,
        lang: 'ko',
        country: 'kr',
        num:1400,
        nextPaginationToken: token 
    }) // -> {data:Array, nextPaginationToken: String}
    return reviews
}

MongoClient.connect(url, {useUnifiedTopology:true}, async function(err, db) {
    if (err) throw err;
    var dbo = db.db(DB_NAME);
    await dbo.collection(COLLECTION_NAME).createIndex({ date: -1 }).then(res=>{console.log(`Index created: ${res}`);})
    await dbo.collection(COLLECTION_NAME).createIndex({ score: -1 }).then(res=>{console.log(`Index created: ${res}`);})
    await dbo.collection(COLLECTION_NAME).createIndex({ replyDate: -1 }).then(res=>{console.log(`Index created: ${res}`);})
    await dbo.collection(COLLECTION_NAME).createIndex({ version: -1 }).then(res=>{console.log(`Index created: ${res}`);})
    await dbo.collection(COLLECTION_NAME).createIndex({ userName: -1 }).then(res=>{console.log(`Index created: ${res}`);})
    

    var loop =0
    while (true){
        try{
            var res = await getReviews()
            dbo.collection(COLLECTION_NAME).insertMany(res.data)
            nextToken = res.nextPaginationToken;
            loop = loop + res.data.length;
            console.log(nextToken, loop)
            if (nextToken == null) {
                break
            }
        } catch(err){
            
        }
    }
});
