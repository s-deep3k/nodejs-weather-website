const request= require('request');
const hbs = require('hbs');
const path= require('path');
const express = require('express');
//Setting up express application
const app = express();
const PORT = process.env.PORT || 4000;
//Setting up a static files path directory 
app.use(express.static(path.join(__dirname,'../public')))
//Setting up views and partials template directory
app.set('view engine','hbs');
app.set('views',path.join(__dirname,'../templates/views'));
hbs.registerPartials(path.join(__dirname,'../templates/partials'));
//Setting up server routes
app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title : 'About Me',
        name : 'Chonky Boi'
    });
})

app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({error: 'Address is required!'})
    }
    const mapurl='https://api.openweathermap.org/data/2.5/weather?q='+req.query.address+'&appid=fd31776b9e56161a027421b42eba2bae';
    request({ url : mapurl, json : true},(error,response)=>{
        if (error){
            res.send({error:"Unable to load location services"});
        }else if(response.body.cod==="404"){
            res.send(response.body);
        }
        else{
            const api= response.body;
            res.send({
                forecast: api.weather[0].description,
                address: req.query.address,
                latitude : api.coord.lat,
                longitude : api.coord.lon,
                minTemp : api.main.temp_min,
                maxTemp: api.main.temp_max,
                pressure: api.main.pressure,
                humidity: api.main.humidity
            })
            //res.send('The latitude and longitude of '+api.query[0]+' are '+api.features[0].center[1]+' and '+api.features[0].center[0]+' respectively.');
        }
      
    })  

    
    // res.render('weather',{
    //     name : 'Weather',
    //     age : 1000000
    // });
})

app.get('/about/*',(req,res)=>{
    res.render('404',{
        title: 404,
        errorMsg : 'About article not found'
    }
)
})

app.get('*',(req,res)=>{
    res.render('404',{
        title: 404,
        errorMsg: 'PAGE NOT FOUND!'
    }
)
})


app.listen(PORT,()=>{
    console.log('Listening to Port',PORT);
})