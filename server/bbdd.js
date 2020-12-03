const mariadb = require("mariadb");

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

/* ----------------------------------------------------------------------
CREATE ONE USER FROM SIGNUP FORM
---------------------------------------------------------------------- */
exports.createUser = async (user) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`
    INSERT INTO users (firebaseID, name, tutorName, phone)
    VALUES
    (
      "${user.firebaseID}",
      "${user.name}",
      "${user.tutorName}",
      ${user.phone}
    )
    `);
    return res;
  } catch (err) {
    console.log(err);
    return;
  } finally {
    if (conn) conn.release(); //release to pool
  }
};

/* ----------------------------------------------------------------------
GET USER NAME
---------------------------------------------------------------------- */
exports.getUserName = async (firebaseID) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`
    SELECT name FROM users
      WHERE firebaseID="${firebaseID}"
    `);
    return res;
  } catch (err) {
    console.log(err);
    return;
  } finally {
    if (conn) conn.release(); //release to pool
  }
};

/* ----------------------------------------------------------------------
CREATE ONE BOOK FORM API GOOGLE
---------------------------------------------------------------------- */
exports.createBook = async (newBook) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`
    INSERT INTO books (ownerID, isbn, title, authors, publisher, publishedDate, description, categories, language, image, textSnippet)
    VALUES
    (
      "${newBook.firebaseID}",
      "${newBook.isbn}",
      "${newBook.title}",
      "${newBook.authors}",
      "${newBook.publisher}",
      "${newBook.publishedDate}",
      "${newBook.description}",
      "${newBook.categories}",
      "${newBook.language}",
      "${newBook.image}",
      "${newBook.textSnippet.substr(0,252).concat('',"...")}"
    )
    `);
    return res;
  } catch (err) {
    console.log(err);
    return;
  } finally {
    if (conn) conn.release(); //release to pool
  }
};

/* ----------------------------------------------------------------------
READ ALL BOOKS FROM ONE USER
---------------------------------------------------------------------- */
exports.getAllMyBooks = async (firebaseID) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`
    SELECT image,title, bookID FROM books
      WHERE ownerID="${firebaseID}"
    `);
    return res;
  } catch (err) {
    console.log(err);
    return;
  } finally {
    if (conn) conn.release(); //release to pool
  }
};

/* ----------------------------------------------------------------------
READ ALL BOOKS FROM EVERY USER EXCEPT THE LOGGED ONE
---------------------------------------------------------------------- */
exports.getAllCatalogue = async (firebaseID) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`
    SELECT books.image, books.title, books.isbn, books.ownerID
  	FROM books
    WHERE NOT books.ownerID="${firebaseID}"
 	  AND NOT EXISTS (SELECT loans.phase
                     	FROM loans
                      WHERE loans.bookID=books.bookID)
    `);
    return res;
  } catch (err) {
    console.log(err);
    return;
  } finally {
    if (conn) conn.release(); //release to pool
  }
};



// SELECT image, title, isbn, ownerID, bookID FROM books
// WHERE NOT ownerID="${firebaseID}"
// AND NOT loans.phase =1

/* ----------------------------------------------------------------------
READ ONE BOOK FROM CATALOGUE
---------------------------------------------------------------------- */
exports.getOneBookDetail = async (isbn) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`
    SELECT * FROM books
    WHERE isbn=${isbn} 
    `);
    return res;
  } catch (err) {
    console.log(err);
    return;
  } finally {
    if (conn) conn.release(); //release to pool
  }
};
/* ----------------------------------------------------------------------
GET BOOK TITLE
---------------------------------------------------------------------- */
exports.getAddedBookTitle = async (isbn, firebaseid) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`
    SELECT title FROM books
    WHERE isbn="${isbn}"
    AND ownerID="${firebaseid}"
    `);
    return res;
  } catch (err) {
    console.log(err);
    return;
  } finally {
    if (conn) conn.release(); //release to pool
  }
};

/* ----------------------------------------------------------------------
UPDATE BOOK PHASE
---------------------------------------------------------------------- */
exports.updateBookPhase = async (bookid, phase, date) => {
  bookid=parseInt(bookid)
  phase=parseInt(phase)
  if(phase<5){
    phase+=1
  }else phase=1
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`
    UPDATE loans
    SET phase=${phase}, ${date}=CURDATE()
    WHERE bookID=${bookid} 
    `);
    return res;
  } catch (err) {
    console.log(err);
    return;
  } finally {
    if (conn) conn.release(); 
  }
};
/* ----------------------------------------------------------------------
CREATE LOAN
---------------------------------------------------------------------- */
exports.createLoan = async (bookid, borrowerid) => {
  bookid=parseInt(bookid)
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`
    INSERT INTO loans (bookID, borrowerID, phase, dateRequest, deathLine)
    VALUES
    (
    ${bookid},
    "${borrowerid}",
    2,
    CURDATE(),
    CURDATE() + INTERVAL 28 DAY
    )
    `);
    return res;
  } catch (err) {
    console.log(err);
    return;
  } finally {
    if (conn) conn.release(); 
  }
};
/* ----------------------------------------------------------------------
READ ASKED BOOKS
---------------------------------------------------------------------- */
exports.getAskedBooks = async (firebaseid) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`
    SELECT books.title, books.image, books.bookID 
    FROM books, loans
    WHERE books.ownerID="${firebaseid}"
    AND loans.bookID=books.bookID
    AND loans.phase=2
    `);
    return res;
  } catch (err) {
    console.log(err);
    return;
  } finally {
    if (conn) conn.release(); 
  }
};
/* ----------------------------------------------------------------------
GET READING BOOKS
---------------------------------------------------------------------- */
exports.getReadingBook = async (firebaseid) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`
    SELECT books.title, books.image, books.bookID, loans.dateLoan, loans.deathLine 
    FROM books, loans
    WHERE loans.borrowerID="${firebaseid}"
    AND loans.bookID=books.bookID
    AND loans.phase=4
    `);
    return res;
  } catch (err) {
    console.log(err);
    return;
  } finally {
    if (conn) conn.release(); 
  }
};

/* ----------------------------------------------------------------------
GET BOOK TITLE
---------------------------------------------------------------------- */
exports.getBookTitle = async (bookid) => {
  bookid=parseInt(bookid)
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`
    SELECT title FROM books
    WHERE bookID=${bookid}
    `);
    return res;
  } catch (err) {
    console.log(err);
    return;
  } finally {
    if (conn) conn.release(); //release to pool
  }
};
/* ----------------------------------------------------------------------
DELETE A BOOK
---------------------------------------------------------------------- */
exports.deleteBook = async (book) => {
  // bookid=parseInt(bookid)
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`
    DELETE FROM books 
    WHERE bookID=${book.bookID}
    `);
    return res;
  } catch (err) {
    console.log(err);
    return;
  } finally {
    if (conn) conn.release(); //release to pool
  }
};

/* ----------------------------------------------------------------------
GET ALL LOANS
---------------------------------------------------------------------- */
exports.getLoanHistory = async (phase) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(`
    SELECT loans.loanID, books.title, books.image, books.isbn, books.bookID,
    owners.name 'ownerName', 
    borrowers.name 'borrowerName',
    borrowers.phone 'borrowerPhone',
    loans.dateRequest, loans.dateLoan, loans.dateReading, loans.dateReturn, loans.dateRest, loans.deathLine, loans.phase
    FROM loans, books, users AS owners, users AS borrowers
    WHERE loans.bookID=books.bookID
    AND books.ownerID=owners.firebaseID
    AND loans.borrowerID=borrowers.firebaseID
    AND phase=${phase}
    `);
    return res;
  } catch (err) {
    console.log(err);
    return;
  } finally {
    if (conn) conn.release(); 
  }
};
