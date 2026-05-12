const { Router } = require("express");

const Blog = require("../models/blog");
const Comment = require("../models/comment");
const path = require("path");
const multer = require("multer");
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploads/`);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}- ${file.originalname}`;
    cb(null, fileName);
  }
})

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

router.get("/delete/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  return res.redirect("/");

});

router.get("/:id", async (req, res)=> {
     const blog = await Blog.findById(req.params.id).populate("createdBy");
     const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
     return res.render("blog", { user: req.user, blog, comments})
});


router.post("/comment/:id", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.id,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.id}`);
});

 router.post("/", upload.single('coverImage'), async (req, res)=> {
      const {title, body} = req.body; 
      const blog = await Blog.create({
        title, 
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
       
       })
  
    return res.redirect(`/blog/${blog._id}`);
 })

module.exports = router;