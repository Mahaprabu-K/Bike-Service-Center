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

SELECT * FROM USERS;
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


DELETE FROM vehicless;
WHERE vehicle_type = 'Car';



CREATE TABLE services (
    id INT PRIMARY KEY IDENTITY(1,1),
    service_name VARCHAR(50),
    price INT,
    image VARCHAR(100)
);


INSERT INTO services (service_name, price, image)
VALUES
('Basic Service', 1099, 'service.jpg'),
('Standard Service', 1500, 'service2.jpg'),
('Premium Service', 1999, 'service3.jpg');

select * from services;
delete  from services;
truncate table services;


CREATE TABLE detailss (

    id INT PRIMARY KEY IDENTITY(1,1),

    name VARCHAR(100),

    price VARCHAR(20),

    image VARCHAR(200)

);

INSERT INTO detailss (name, price, image)

VALUES
('Standard Service',
 '1999',
 'service2.jpg');


 delete from detailss;
  select * from detailss;
  truncate table detailss;



CREATE TABLE inclusions (

    id INT PRIMARY KEY IDENTITY(1,1),

    service_id INT,

    inclusion_name VARCHAR(200)

);


INSERT INTO inclusions (service_id, inclusion_name)

VALUES

(1,'Engine Oil Change'),
(1,'Bike Wash'),
(1,'Air Filter Cleaning'),
(1,'Brake Cleaning'),
(1,'Clutch Adjustment'),
(1,'Chain Sprocket Tightening and Checking'),
(1,'Basic Electrical Check'),
(1,'Battery Check'),
(1,'Spark Plug Cleaning');


INSERT INTO inclusions (service_id, inclusion_name)

VALUES

(2,'Full Bike Inspection'),
(2,'Oil Change'),
(2,'Brake Adjustment'),
(2,'Battery Check'),
(2,'Chain Lubrication'),
(2,'General Cleaning');

select * from detailss;
select * from inclusions;