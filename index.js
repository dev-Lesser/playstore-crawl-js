// root: jsname=fk8dgd

// 사용자이름 span class X43Kjb
// 별점 div class pf5lIe > div aria-label= 5점만점에 3점을 맞았습니다
// 날짜 span class=p2TkOb
// 추천수 div class="XlMhZe" > div class="jUL89d y92BAb K3ZHGe" text
// 리뷰 span jsname="bN97Pc" text

var gplay = require('google-play-scraper');
 
// This example will return 3000 reviews
// on a single call
// gplay.reviews({
//   appId: 'droom.sleepIfUCan',
//   sort: gplay.sort.NEWEST,
//   num: 3000,
//   lang: 'ko',
//   country: 'kr',
// }).then(console.log, console.log);
 
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


// function()
const getReviews = async () => {
    var reviews = await gplay.reviews({
        appId: 'droom.sleepIfUCan',
        sort: gplay.sort.HELPFULNESS,
        paginate: true,
        lang: 'ko',
        country: 'kr',
        num:1,
        nextPaginationToken: null // you can omit this parameter
      })//.then(console.log)  // -> {data:Array, nextPaginationToken: String}
    //   console.log(reviews)
      return reviews
}
MongoClient.connect(url, {useUnifiedTopology:true}, function(err, db) {
    if (err) throw err;
    var dbo = db.db("droom");
    getReviews()
    .then(res =>{
        // console.log(res.data)
        // console.log(res.nextPaginationToken)
        
            
            for (var review in res){
                var myobj = review;
                console.log(review)
                dbo.collection("reviews").insertOne(myobj, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    // db.close();
                  });
            }
            
            
          });
    console.log(12)
        //   db.close();
    });
// console.log(res.data)

// gplay.reviews({
//   appId: 'droom.sleepIfUCan',
//   sort: gplay.sort.NEWEST,
//   paginate: true,
//   lang: 'ko',
//   country: 'kr',
//   nextPaginationToken: 'TOKEN_FROM_THE_PREVIOUS_REQUEST' // you can omit this parameter
// }).then(console.log, console.log);