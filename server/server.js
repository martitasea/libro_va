const mariadb = require("mariadb");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes.js");
const port = 5000;
const cors = require("cors");


//------------------------------------------------------------------------------
// BBDD CONECTION MARIADB - LIBROVA
//------------------------------------------------------------------------------
const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "",
    connectionLimit: 5,
    database: "librova",
  });


//------------------------------------------------------------------------------
// MIDDLEWARE
//------------------------------------------------------------------------------ 
app.use(bodyParser.urlencoded({ extended: false })); //hace accesible la info
app.use(bodyParser.json()); // parse application/json
app.use(express.static("public")); //esta es la carpeta que mandamos a cliente
app.use(cors())


//------------------------------------------------------------------------------
//ROUTES
//------------------------------------------------------------------------------
// Create user from signup form
app.post("/createuser", routes.createUser);

// Get user name
app.get("/getusername/:firebaseid", routes.getUserName);

// Read one book from google API
app.post("/getbookapi/:isbn/:firebaseid", routes.getBookApi);

// Read all my books
app.get("/getallmybooks/:firebaseid", routes.getAllMyBooks);

// Read all catalogue
app.get("/allcatalogue/:firebaseid", routes.getAllCatalogue);

// Read one book from catalogue
app.get("/onebookdetail/:isbn", routes.getOneBookDetail);

// Read title from just addedbook
app.get("/getaddedbooktitle/:isbn/:firebaseid", routes.getAddedBookTitle);

// Update book a from rest to request
app.get("/updatebookphase/:bookid/:phase/:date", routes.updateBookPhase);

//Create loan
app.get("/createloan/:bookid/:borrowerid", routes.createLoan);

//Read asked books
app.get("/getbooks/:firebaseid/:phase", routes.getBooks);

//Read reading book
app.get("/getreadingbook/:firebaseid", routes.getReadingBook);

// Read book title
app.get("/getbooktitle/:bookid", routes.getBookTitle);

// Delete one book
app.post("/deletebook/:bookid", routes.deleteBook);

// Get all loans phase 3 or 6
app.get("/getloanhistory/:phase", routes.getLoanHistory);

// Get all loans phase 3 or 6
app.get("/getallloans", routes.getAllLoans);

// Get all users
app.get("/getallusers", routes.getAllUsers);

// Get number books
app.get("/getnumberbooks", routes.getNumberBooks);

// Get number books
app.get("/getnotifications", routes.getNumberBooks);

//------------------------------------------------------------------------------
// CREATE USERS TABLE
//------------------------------------------------------------------------------
//   async function asyncFunction(){
//     let conn;
//     try {
//         conn = await pool.getConnection();
//         const rows = await conn.query("SELECT 1 as val");
//         const usersTable = await conn.query(`
//         CREATE TABLE users (
//           firebaseID VARCHAR(30) NOT NULL, 
//           name VARCHAR(300) NOT NULL,
//           tutorName VARCHAR(30) NOT NULL,
//           phone INT(9) NOT NULL,
//           rol VARCHAR (10) NOT NULL DEFAULT user,
//           PRIMARY KEY (firebaseID)
//           );
//         `)
//     }
//     catch (err) {
//         throw err;
//       } finally {
//         if (conn) conn.release(); //release to pool
//       }
// }
// asyncFunction();

//------------------------------------------------------------------------------
// CREATE BOOKS TABLE
//------------------------------------------------------------------------------
//   async function asyncFunction(){
//     let conn;
//     try {
//         conn = await pool.getConnection();
//         const rows = await conn.query("SELECT 1 as val");
//         const booksTable = await conn.query(`
//         CREATE TABLE books (
//           bookID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//           ownerID VARCHAR(300) NOT NULL,
//           isbn VARCHAR(20) NOT NULL, 
//           phase VARCHAR (20) NOT NULL,
//           title VARCHAR(100) NOT NULL,
//           authors VARCHAR(100),
//           publisher VARCHAR (30),
//           publishedDate DATE,
//           description VARCHAR(255),
//           pageCount,
//           categories VARCHAR(100),
//           languaje VARCHAR(15),
//           image VARCHAR(255),
//           textSnippet VARCHAR (200)
//           );
//         `)
//     }
//     catch (err) {
//         throw err;
//       } finally {
//         if (conn) conn.release(); //release to pool
//       }
// }
// asyncFunction();

//------------------------------------------------------------------------------
// ALTER BOOKS TABLE - FOREIGN KEY
//------------------------------------------------------------------------------
// async function asyncFunction(){
//   let conn;
//   try {
//       conn = await pool.getConnection();
//       const rows = await conn.query("SELECT 1 as val");
//       const booksTable = await conn.query(`
//       ALTER TABLE books
//       ADD CONSTRAINT FK_ownerID
//         FOREIGN KEY (ownerID) 
//         REFERENCES users (firebaseID);
//       `)
//   }
//   catch (err) {
//       throw err;
//     } finally {
//       if (conn) conn.release(); //release to pool
//     }
// }
// asyncFunction();

//------------------------------------------------------------------------------
// CREATE LOANS TABLE
//------------------------------------------------------------------------------
// async function asyncFunction(){
//   let conn;
//   try {
//       conn = await pool.getConnection();
//       const rows = await conn.query("SELECT 1 as val");
//       const loansTable = await conn.query(`
//       CREATE TABLE loans (
//         loanID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
//         bookID INT NOT NULL,
//         borrowerID VARCHAR(30) NOT NULL,
//         phase VARCHAR (20) NOT NULL,
//         dateRequest DATE NOT NULL,
//         dateLoan DATE NOT NULL,
//         dateReading DATE NOT NULL,
//         dateReturn DATE NOT NULL,
//         dateRest DATE NOT NULL,
//         deadLine DATE NOT NULL,
//         CONSTRAINT FK_borrowerbook
//             FOREIGN KEY (borrowerID) REFERENCES users (firebaseID),
//         CONSTRAINT FK_bookID
//             FOREIGN KEY (bookID) REFERENCES books (bookID)
//         ); 
//       `)
//   }
//   catch (err) {
//       throw err;
//     } finally {
//       if (conn) conn.release(); //release to pool
//     }
// }
// asyncFunction();

//------------------------------------------------------------------------------
// DEFINICIÓN DEL PUERTO AL QUE TIENEN QUE ATENDER
//------------------------------------------------------------------------------
app.listen(port, () => {
    console.log("-----------------------------------------------------------------------------------------")
    console.log(
      `TU SERVIDOR LOCAL ESTÁ EN LA SIGUIENTE RUTA http://localhost:${port}`
    );
    console.log("-----------------------------------------------------------------------------------------")
  });
  