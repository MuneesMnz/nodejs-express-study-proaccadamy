//IMPORT PACKAGE

const express = require("express");
const fs = require("fs");
const app = express();

const movies = JSON.parse(fs.readFileSync("./data/movies.json"));

app.use(express.json());

// ROUTE HANDLER FUNCTION
// -------------------------

// Route Handler for get all movies
const getAllMovies = (req, res) => {
  res.status(200).json({
    status: "success",
    count: movies.length,
    data: {
      movies: movies,
    },
  });
};

// Route Handler for get single movie
const getMovie = (req, res) => {
  //the params will be string so we want to convert it to number bcoz in our data it is in number
  //here the method for converting string to number
  const id = req.params.id * 1;

  //taking single object with id in array using find()
  const movie = movies.find((item) => item.id === id);

  //sending responce of single movie based on id
  if (movie) {
    res.status(200).json({
      status: "success",
      data: {
        movie: movie,
      },
    });
    //if there id is not valid below responce will send
  } else {
    return res.status(404).json({
      status: "failed",
      message: `Movie with ID ${id} is not found `,
    });
  }
};

// Route Handler for add movie
const addMovie = (req, res) => {
  const newId = movies[movies.length - 1].id + 1;
  const newMovie = Object.assign({ id: newId }, req.body);
  movies.push(newMovie);
  fs.writeFile("./data/movies.json", JSON.stringify(movies), (error) => {
    res.status(201).json({
      status: "success",
      data: {
        movie: newMovie,
      },
    });
  });
};
// Route Handler for Update Movie
const updateMovie = (req, res) => {
  //getting params id value and set to number
  const id = req.params.id * 1;
  //find object by id using find() method
  const UpdatedMovie = movies.find((item) => item.id === id);

  //Ifthere is no data with id from the requset id
  if (!UpdatedMovie) {
    return res.status(404).json({
      status: "fail",
      message: `no Movie Object with ID of ${id}`,
    });
  } else {
    //finding index number of the object
    const index = movies.indexOf(UpdatedMovie);

    //mergging objects of updated movie object and request object
    Object.assign(UpdatedMovie, req.body);

    //setting value to the object and send responce
    movies[index] = UpdatedMovie;
    fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
      res.status(200).json({
        status: "success",
        data: {
          movie: UpdatedMovie,
        },
      });
    });
  }
};

const deleteMovie = (req, res) => {
  //getting params id value and set to number
  const id = +req.params.id; //another way of converting string to number

  //find object by id using find() method
  const MovieToDelete = movies.find((item) => item.id === id);

  if (!MovieToDelete) {
    res.status(404).json({
      status: "fail",
      message: `Cannout find data with the id of ${id}`,
    });
  }

  //finding index number of the object
  const index = movies.indexOf(MovieToDelete);

  //using splice removing object from the array
  movies.splice(index, 1);
  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
    res.status(204).json({
      status: "success",
      data: {
        movie: null,
      },
    });
  });
};

// GET- /api/v1/movies
//v1 -it means vertion of the api when we change api setting
// app.get("/api/v1/movies", getAllMovies);

// GET- /api/v1/movies/id (id is params)

//  we can pass one or more parametes in the router but there wiil be a if we didin't give ? the route will be compalsory
//so we want to give 3 params in there if i give ? in name and abc it wil not required
// app.get("/api/v1/movies/:id/:name?/:abc?", (req, res) => {

// app.get("/api/v1/movies/:id", getMovie);

// POST- /api/v1/movies
// app.post("/api/v1/movies", addMovie);

// PATCH- /api/v1/movies/:id
// app.patch("/api/v1/movies/:id", updateMovie);

//DELETE- /api/v1/movies/:id
// app.delete("/api/v1/movies/:id", deleteMovie);

// OR we can also assign the route like below

app.route("/api/v1/movies").get(getAllMovies).post(addMovie);

app
  .route("/api/v1/movies/:id")
  .get(getMovie)
  .patch(updateMovie)
  .delete(deleteMovie);

//CREATE SERVER
const port = 3000;
app.listen(port, () => {
  console.log("server started...");
});

// -----------------------------------------------------------------
// Extras

// app.get("/", (req, res) => {
//SEND

//we can only use send for while content-type=text/html not for application/json
//that means we cannot send data only we can sebd html,text,messages etc..
//   res.status(200).send("<h4>hello from ther server</h4>");

//JSON

//we can send json data using prop of json
//   res.status(200).json({ message: "hello world", status: 200 }); //
// });
