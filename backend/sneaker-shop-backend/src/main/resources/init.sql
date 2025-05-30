-- Schema
CREATE TABLE IF NOT EXISTS user (id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                name VARCHAR(255),
                                email VARCHAR(255) UNIQUE NOT NULL,
                                password VARCHAR(255) NOT NULL,
                                role VARCHAR(50)
    );

CREATE TABLE IF NOT EXISTS orders (id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                    status VARCHAR(50),
                                    total DOUBLE,
                                    created_at DATETIME,
                                    user_id BIGINT,
FOREIGN KEY (user_id) REFERENCES user(id)
    );

-- Seed data
INSERT INTO user (id, name, email, password, role) VALUES
    (1, 'Đinh Quang Linh', '21130421@st.hcmuaf.edu.vn', '$2a$10$D9KM0Z2c8xIDrJokVqsZoOxWwHEB3NzCMyLheRRfJ1Scuz9Iq0a6S', 'USER'); -- password: 123456

INSERT INTO orders (id, status, total, created_at, user_id) VALUES
(1, 'DELIVERED', 150.0, '2024-01-20T12:00:00', 1),
(2, 'SHIPPED', 90.5, '2024-01-25T09:30:00', 1);