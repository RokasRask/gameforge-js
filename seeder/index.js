import { users } from './users.js';
import mysql from 'mysql';
import bcrypt from 'bcrypt';

// Salt rounds for bcrypt
const saltRounds = 10;

// Create MySQL connection
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Update with your MySQL password if needed
    database: 'gameforge' // Database name
});

con.connect(err => {
    if (err) throw err;
    console.log('Connected to database!');

    // Drop existing tables if they exist
    const dropTables = [
        'DROP TABLE IF EXISTS sessions;',
        'DROP TABLE IF EXISTS ratings;',
        'DROP TABLE IF EXISTS games;',
        'DROP TABLE IF EXISTS users;'
    ];

    dropTables.forEach((query, index) => {
        con.query(query, (err) => {
            if (err) throw err;
            console.log(`Table ${index + 1} dropped!`);
        });
    });

    // Create tables
    const createTables = [
        // Users table
        `
        CREATE TABLE users (
            id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin') NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `,
        // Games table
        `
        CREATE TABLE games (
            id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            game_name VARCHAR(255) NOT NULL,
            creator_id INT(10) UNSIGNED NOT NULL,
            description TEXT NOT NULL,
            category VARCHAR(100) NOT NULL,
            thumbnail_path VARCHAR(255) NOT NULL,
            build_folder_path VARCHAR(255) NOT NULL,
            rating DECIMAL(3,2) NOT NULL DEFAULT 0,
            play_count INT(10) UNSIGNED NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            status ENUM('active', 'inactive', 'featured') NOT NULL DEFAULT 'active',
            FOREIGN KEY (creator_id) REFERENCES users(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `,
        // Ratings table (for user ratings)
        `
        CREATE TABLE ratings (
            id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            game_id INT(10) UNSIGNED NOT NULL,
            user_id INT(10) UNSIGNED NOT NULL,
            rating INT(1) NOT NULL CHECK (rating BETWEEN 1 AND 5),
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (game_id) REFERENCES games(id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE KEY user_game_rating (user_id, game_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `,
        // Sessions table
        `
        CREATE TABLE sessions (
            id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INT(10) UNSIGNED NOT NULL,
            token CHAR(32) NOT NULL,
            expires DATETIME NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `
    ];

    // Execute each CREATE TABLE query
    createTables.forEach((query, index) => {
        con.query(query, (err) => {
            if (err) throw err;
            console.log(`Table ${index + 1} created!`);
        });
    });

    // Process users with bcrypt password hashing
    Promise.all(users.map(async user => {
        const hashedPassword = await bcrypt.hash('123', saltRounds);
        return [user.id, user.name, user.email, hashedPassword, user.role];
    })).then(userValues => {
        // Insert users
        const insertUsers = `
            INSERT INTO users (id, name, email, password, role)
            VALUES ?`;

        con.query(insertUsers, [userValues], (err) => {
            if (err) throw err;
            console.log('Users inserted!');

            // Close database connection
            con.end(err => {
                if (err) throw err;
                console.log('Database connection closed!');
            });
        });
    }).catch(error => {
        console.error('Error processing users:', error);
        con.end();
    });
});