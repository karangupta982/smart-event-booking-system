SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS events;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  date DATETIME NOT NULL,
  total_seats INT NOT NULL DEFAULT 0,
  available_seats INT NOT NULL DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0.00,
  img VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_events_date (date),
  INDEX idx_events_location (location)
) ENGINE=InnoDB;

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  mobile VARCHAR(50),
  quantity INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('confirmed','cancelled') DEFAULT 'confirmed',
  updated_at TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT fk_booking_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  INDEX idx_bookings_event_id (event_id)
) ENGINE=InnoDB;
