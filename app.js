const express =require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const app= express();

//for parsing body data like data send from a form
app.use(bodyParser.urlencoded({extended:true}));

//*******for static file like css**********
app.use(express.static("public"));

app.get("/",(req,res)=>{
	res.sendFile(__dirname+"/signup.html");
})

app.post("/",(req,res)=>{
	const firstName=req.body.firstName;
	const lastName=req.body.lastName;
	const email=req.body.email;

	//creating javascript object to send to mailchimp api
	const data={
		members:[
		   {
		   	email_address:email,
		   	status:"subscribed",
		   	merge_fields:{
		   		FNAME:firstName,
		   		LNAME:lastName
		   	}
		   }
		]
	}
	//converting data to JSON format before sending
	const jsonData=JSON.stringify(data);

	const url="https://us18.api.mailchimp.com/3.0/lists/abd4889419";
	const options={
		method:"POST",
		auth:"lwithwma:9cf6eaa1cfb0842195f4dc0ffefa8fe8-us18"
	}

	//sending and receiving response data from mailchimp api
	const request=https.request(url,options,(response)=>{
           if(response.statusCode===200){
           	res.sendFile(__dirname +"/success.html");
           }else{
           	res.sendFile(__dirname + "/failure.html");
           }
	})

	request.write(jsonData);
	request.end();
})

app.post("/failure",(req,res)=>{
	res.redirect("/");
})


app.listen(process.env.PORT || 3000,()=>{
	console.log(`Server is listening on port ${process.env.PORT}`);
})

