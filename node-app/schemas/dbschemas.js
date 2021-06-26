const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema({
    name : String,
    email : String,
    password: String,
    reset : Boolean
});

const Credential = mongoose.model("Credential", credentialSchema);

const postSchema = new mongoose.Schema({
    userid : mongoose.Schema.Types.ObjectId ,
    c_name : String,
    c_role: String,
    branch : String,
    desc: String,
    u_name: String,
    title: String,
    time: Date
});
const Post = mongoose.model("Post", postSchema);

// mySchema.index({field1: 1, field2: 1}, {unique: true});
postSchema.index({time:1});

const companySchema = new mongoose.Schema({
    company_name : String,
    company_roles : [String]
});

const Company = mongoose.model("Company", companySchema);


module.exports =  {Credential, Post, Company}