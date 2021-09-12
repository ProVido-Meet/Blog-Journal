//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Your posts shown below.";
const aboutContent = "Developed by GYANAM. This is Blog Post Social Media.";
const contactContent = "Contact email address is ";

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://gyanam-admin:Gyanam@dailyjournal.aewl0.mongodb.net/blogDB", { useNewUrlParser: true });

const postSchema = {
    title: String,
    subtitle: String,
    author: String,
    profile: String,
    banner: String,
    image: String,
    content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {

    Post.find({}, function(err, posts) {
        res.render("home", {
            startingContent: homeStartingContent,
            posts: posts,
            year: new Date().getFullYear()
        });
    });
});

app.get("/compose", function(req, res) {
    res.render("compose", { year: new Date().getFullYear() });
});

app.post("/compose", function(req, res) {
    const post = new Post({
        title: req.body.postTitle,
        subtitle: req.body.postSub,
        author: req.body.authorName,
        profile: req.body.profile,
        banner: req.body.banner,
        image: req.body.imageURL,
        content: req.body.postBody
    });


    post.save(function(err) {
        if (!err) {
            res.redirect("/");
        }
    });
});

app.get("/posts/:postId", function(req, res) {

    const requestedPostId = req.params.postId;

    Post.findOne({ _id: requestedPostId }, function(err, post) {
        res.render("post", {
            title: post.title,
            subtitle: post.subtitle,
            author: post.author,
            profile: post.profile,
            banner: post.banner,
            image: post.image,
            content: post.content,
            id: post._id,
            year: new Date().getFullYear()
        });
    });

});

app.get("/about", function(req, res) {
    res.render("about", { aboutContent: aboutContent, year: new Date().getFullYear() });
});

app.get("/contact", function(req, res) {
    res.render("contact", { contactContent: contactContent, year: new Date().getFullYear() });
});

app.get("/news", (req, res) => {
    res.render("news", { year: new Date().getFullYear() });
});

app.get("/courses/all/", (req, res) => {
    res.render('globalcompose', { year: new Date().getFullYear() });
})

app.use(function(req, res) {
    res.status(404).render('404');
});


app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});