CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Phone VARCHAR(15),
    Whatsapp VARCHAR(15),
    Email VARCHAR(100),
    Gender VARCHAR(10),
    Username VARCHAR(50) UNIQUE,
    Password VARCHAR(100)
);

SELECT * FROM Users;
delete FROM USERS;
TRUNCATE TABLE users;


CREATE TABLE vehicless (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    vehicle_type VARCHAR(50),
    brand VARCHAR(50),
    model VARCHAR(50),
    fuel VARCHAR(20)
);

SELECT * FROM vehicless;


INSERT INTO vehicless (vehicle_type, brand, model, fuel) VALUES
('Bike', 'Honda', 'Shine', 'Petrol'),
('Bike', 'Honda', 'Activa', 'Petrol'),
('Bike', 'Yamaha', 'R15', 'Petrol'),
('Bike', 'Yamaha', 'RX100', 'Petrol');







select * from services;


CREATE TABLE services (
    id INT PRIMARY KEY,
    service_name VARCHAR(100),
    price INT,
    image VARCHAR(100),
    brand VARCHAR(50)
);

drop table services;

delete from services;
drop table services;

truncate table services;

CREATE TABLE services (
    id INT PRIMARY KEY IDENTITY(1,1),
    service_name VARCHAR(100),
    price INT,
    image VARCHAR(100),
    brand VARCHAR(50)
);

INSERT INTO services (service_name, price, image, brand) VALUES
('Standard Service', 2999, 'service1.jpg', 'Honda'),
('Premium Service', 4099, 'service2.jpg', 'Honda'),
('AC Service', 1699, 'service3.jpg', 'Honda'),
('Oil Service', 999, 'service4.jpg', 'Activa');


CREATE TABLE services (
    id INT IDENTITY(1,1) PRIMARY KEY,
    service_name VARCHAR(100),
    price INT,
    image VARCHAR(255)
);

ALTER TABLE services
ADD brand VARCHAR(100);

INSERT INTO services (service_name, price, image, brand)
VALUES 
('Bike Service', 1099, 'service.jpg', 'Honda'),
('Standard Service', 1499, 'service2.jpg', 'Honda'),
('Premium Service', 2000, 'service3.jpg', 'Yamaha');


INSERT INTO services (service_name, price, image, brand)
VALUES 
('General Service', 1499, 'service4.jpg', 'Honda');


CREATE TABLE service_inclusions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    service_id INT,
    inclusion_text VARCHAR(255),

    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- 👉 Service 1 → 6 inclusions
INSERT INTO service_inclusions (service_id, inclusion_text)
VALUES 
(1, 'Engine oil replacement'),
(1, 'Brake inspection'),
(1, 'Chain lubrication'),
(1, 'Battery check'),
(1, 'Tyre pressure check'),
(1, 'General inspection');


-- 👉 Service 2 → 10 inclusions
INSERT INTO service_inclusions (service_id, inclusion_text)
VALUES 
(2, 'Engine oil change'),
(2, 'Oil filter cleaning'),
(2, 'Air filter cleaning'),
(2, 'Brake pad check'),
(2, 'Chain adjustment'),
(2, 'Clutch adjustment'),
(2, 'Battery check'),
(2, 'Electrical check'),
(2, 'Tyre pressure check'),
(2, 'Bike wash');



 select * from service_inclusions;
 SELECT * FROM service_inclusions WHERE service_id = 3;


 CREATE TABLE bookings (
    id INT IDENTITY(1,1) PRIMARY KEY,

    service_id INT NOT NULL,
    user_id INT NOT NULL,

    firstname VARCHAR(100),
    lastname VARCHAR(100),
    mobno VARCHAR(20),

    booking_date DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

select * from bookings;

ALTER TABLE bookings
add service_id int;

ALTER TABLE bookings
DROP COLUMN service_id;


drop table bookings;

delete from bookings;

truncate table bookings;


EXEC sp_help users;


CREATE TABLE bookings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    firstname VARCHAR(100),
    lastname VARCHAR(100),

    brand VARCHAR(100),
    model VARCHAR(100),
    service VARCHAR(100),
    price INT,

    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (user_id) REFERENCES Users(id)
);