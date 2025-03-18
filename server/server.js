// backend/server.js

const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 8000;
const bcrypt = require("bcrypt"); // ✅ Import bcrypt for hashing passwords
const jwt = require("jsonwebtoken"); // ✅ Import JWT for authentication

app.use(cors());
app.use(express.json());
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads directory created successfully.");
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Root',
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
  
  db.query('CREATE DATABASE IF NOT EXISTS photo_album', (err) => {
    if (err) throw err;
    console.log('Database photo_album created or already exists.');

    db.query('USE photo_album', (err) => {
      if (err) throw err;
      console.log('Using database photo_album');

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS images (
          id INT AUTO_INCREMENT PRIMARY KEY,
          image VARCHAR(255) NOT NULL
        )
      `;
      const createTableQuery1 = `
        CREATE TABLE IF NOT EXISTS user (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            passwords TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

      db.query(createTableQuery, (err) => {
        if (err) throw err;
        console.log('Table images created or already exists.');
        
      });
      db.query(createTableQuery1, (err) => {
        if (err) throw err;
        console.log('Table images created or already exists.');
      });
    });
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  const image = req.file.filename;
  const sql = 'INSERT INTO images (image) VALUES (?)';
  db.query(sql, [image], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Image uploaded successfully', image });
  });
});

app.get('/images', (req, res) => {
  const sql = 'SELECT * FROM images';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


app.delete('/images/:id', (req, res) => {
  const { id } = req.params;
  const getImageQuery = 'SELECT image FROM images WHERE id = ?';
  const deleteImageQuery = 'DELETE FROM images WHERE id = ?';

  db.query(getImageQuery, [id], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const image = results[0].image;
    const imagePath = path.join(__dirname, 'uploads', image);

    db.query(deleteImageQuery, [id], (err) => {
      if (err) throw err;

      fs.unlink(imagePath, (err) => {
        if (err) throw err;
        res.json({ message: 'Image deleted successfully' });
      });
    });
  });
});
const SECRET_KEY = "jhgyewtuiy2673248wryiuerwyi"; // 🔒 Replace with a secure secret key

app.post("/login", async(req, res) => {
    const { email, password } = req.body;
    console.log(email, password, "ghjsagjhgasjdg")
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const query = "SELECT * FROM user WHERE email = ?";
        db.query(query, [email], async (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

            const user = results[0];

            // ✅ Check if user.password is undefined
            if (!user.passwords) {
                return res.status(500).json({ error: "Internal error: User password not found" });
            }

            // ✅ Compare the entered password with the hashed password in DB
            const isMatch = await bcrypt.compare(password, user.passwords);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // ✅ Generate JWT Token (for authentication)
            const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

            res.status(200).json({ message: "Login successful", token });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
})
app.post("/create", async(req, res) => {
  const { email, password } = req.body;
  console.log(email, password, "ghjsagjhgasjdg")
  if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
  }
  try {
      // ✅ Hash the password before saving
      const saltRounds = 10; // Higher rounds = better security but slower
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // ✅ Save user with hashed password
      const query = "INSERT INTO user (email, passwords) VALUES (?, ?)";
      db.query(query, [email, hashedPassword], (err, result) => {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          res.status(201).json({ message: "User registered successfully!" });
      });
  } catch (error) {
      res.status(500).json({ error: "Server error" });
  }
})
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
