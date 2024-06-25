import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";

// Initialize Express app
const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride('_method'));

// Set up EJS as the view engine
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let blogPosts = [];
let nextId = 1; // Initial id

// Render the index page
app.get("/", (req, res) => {
    res.render("index");
});

// Render the form to create a new blog post
app.get("/create-blog", (req, res) => {
    res.render("create-blog");
});

// Handle form submission to create a new blog post
app.post("/create", (req, res) => {
    const title = req.body["blog-title"];
    const content = req.body["blog-content"];
    const blogPost = { id: nextId++, title, content };
    blogPosts.push(blogPost);
    console.log("Post created:", blogPost);
    res.redirect("/view");
});

// Render the view blogs page
app.get("/view", (req, res) => {
    res.render("view-blogs", { blogPosts });
});

// Render the edit blog post form
//This route handles GET requests for editing a 
//specific blog post identified by :id, which is a parameter in the URL.
app.get("/edit-post/:id", (req, res) => {
    const postIndex = blogPosts.findIndex(post => post.id === parseInt(req.params.id));
    if (postIndex >= 0) {
        const post = blogPosts[postIndex];
        res.render("edit-post", { post });
    } else {
        res.status(404).send("Post not found");
    }
});

// Handle edit blog post
app.put("/edit/:id", (req, res) => {
    const postIndex = blogPosts.findIndex(post => post.id === parseInt(req.params.id));
    if (postIndex >= 0) {
        blogPosts[postIndex].title = req.body["blog-title"];
        blogPosts[postIndex].content = req.body["blog-content"];
        console.log("Post edited:", blogPosts[postIndex]);
        res.redirect("/view");
    } else {
        res.status(404).send("Post not found");
    }
});

// Handle delete blog post
app.get("/delete-post/:id", (req, res) => {
    const postIndex = blogPosts.findIndex(post => post.id === parseInt(req.params.id));
    if (postIndex >= 0) {
        console.log("Post deleted:", blogPosts[postIndex]);
        blogPosts.splice(postIndex, 1);
        res.redirect("/view");
    } else {
        res.status(404).send("Post not found");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
