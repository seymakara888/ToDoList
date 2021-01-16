
//mongodb+srv://admin:<password>@cluster1.0o9nc.mongodb.net/<dbname>?retryWrites=true&w=majority
               const express = require("express");
               const bodyParser = require("body-parser");
               const app = express();
               app.set("view engine", "ejs");
               app.use(bodyParser.urlencoded( {extended : true} ));
               app.use(express.static(__dirname + "/dosyalar"));
               const mongoose = require("mongoose");
               const Schema = mongoose.Schema;
               mongoose.connect("mongodb+srv://admin:1234@cluster1.0o9nc.mongodb.net/Cluster1?retryWrites=true&w=majority"
                              , {useNewUrlParser: true , useUnifiedTopology : true});
                              var yapilacakListesi = new Schema(
                    {
                      gorev : String,
                      tarih : Date
                    }
                  );
                  var Gorev = mongoose.model("Gorev", yapilacakListesi);
                  /*Gorev.findOneAndUpdate({gorev : "Deneme"} , {gorev : "Ders çalış"}, function(err, results){
                    console.log(results);
                  });
                  Gorev.create({gorev : "Askere git.", tarih : new Date()}, function(err, result){
                  	console.log(result);
                  })*/
                  app.get("/", function(req, res) {
                      Gorev.find({} , null ,  {sort : { tarih : 'desc' } }  , function(err, gelenVeriler){
                         console.log(gelenVeriler);
                        if(gelenVeriler.length < 1){  // eğer veritabanından gelen veri sayısı 0'sa
                          var array = [
                            {
                              gorev: "ToDoList'e hoşgeldin",
                              tarih: new Date()
                            },
                            {
                              gorev : "+ butonuna tıklayarak veri ekleyebilirsin.",
                              tarih : new Date()
                            },
                            {
                              gorev : "<-- Görevi silmek için tıklayın.",
                              tarih : new Date()
                            }
                          ];
                          Gorev.insertMany(array, function(err, results){
                            res.redirect("/");
                          })
                        }else{
                          res.render("anasayfa", {  gorevler : gelenVeriler });
                        }
                      });
                  });
                  app.post("/ekle", function(req, res){
                    var gelenAciklama = req.body.gorevAciklama;
                    var gorev = new Gorev(
                      {
                        gorev: gelenAciklama,
                        tarih: new Date()
                      }
                    );
                    gorev.save(function(err){
                      res.redirect("/");
                    });
                  });
                  app.post("/sil", function(req, res){
                      var dokumanID = req.body.id;
                      Gorev.deleteOne({ _id : dokumanID }, function(err){
                          res.redirect("/");
                      })
                  });


                  let port = process.env.PORT;
                  if(port == "" || port == null){
                    port = 5000;
                  }
                  app.listen(port, function(){
                    console.log("port numarasi : " + port);
                  });
