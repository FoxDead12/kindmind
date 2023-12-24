CREATE TABLE subjects (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
    FULLTEXT (name)
);

CREATE TABLE education_level (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE locations (
    id INT NOT NULL AUTO_INCREMENT,
    country VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    FULLTEXT (country, city)
);


CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    hash TEXT NOT NULL,
    role INT NOT NULL,
    activate TINYINT(1) DEFAULT 0,
    image_url TEXT DEFAULT NULL,
    location_id INT DEFAULT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (location_id) REFERENCES locations(id)
);

CREATE TABLE teacher_information (
    id INT NOT NULL AUTO_INCREMENT,
    id_user INT NOT NULL,
    hour_payment FLOAT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    about_class TEXT DEFAULT NULL,
    online TINYINT(1) DEFAULT NULL,
    presencial TINYINT(1) DEFAULT NULL,
    valid TINYINT(1) DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (id_user) REFERENCES users(id)
);

CREATE TABLE teacher_subjects (
    id INT NOT NULL AUTO_INCREMENT,
    id_user INT NOT NULL,
    id_subject INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_subject) REFERENCES subjects(id),
    UNIQUE(id_user, id_subject)
);

CREATE TABLE teacher_education_level (
    id INT NOT NULL AUTO_INCREMENT,
    id_user INT NOT NULL,
    id_level INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_level) REFERENCES education_level(id)
);

CREATE TABLE classes (
    id INT NOT NULL AUTO_INCREMENT,
    id_student INT NOT NULL,
    id_professor INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    duration FLOAT NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (id_student) REFERENCES users(id),
    FOREIGN KEY (id_professor) REFERENCES users(id)
);

CREATE TABLE messages (
    id INT NOT NULL AUTO_INCREMENT,
    send_user INT NOT NULL,
    receiver_user INT NOT NULL,
    message TEXT NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (send_user) REFERENCES users(id),
    FOREIGN KEY (receiver_user) REFERENCES users(id)
);
