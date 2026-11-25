const table = "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

export const schema = [
  `CREATE TABLE IF NOT EXISTS administrators (
    id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(254) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL, password_hash VARCHAR(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    role ENUM('super_admin','admin') NOT NULL, active TINYINT NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
    created_at BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP()), updated_at BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP())
  ) ${table}`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY, administrator_id INT NOT NULL,
    expires_at BIGINT NOT NULL, INDEX(expires_at),
    FOREIGN KEY(administrator_id) REFERENCES administrators(id) ON DELETE CASCADE
  ) ${table}`,
  `CREATE TABLE IF NOT EXISTS audit (
    id INT AUTO_INCREMENT PRIMARY KEY, administrator_id INT NULL,
    action VARCHAR(100) NOT NULL, subject VARCHAR(255) NOT NULL, created_at BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP()),
    FOREIGN KEY(administrator_id) REFERENCES administrators(id)
  ) ${table}`,
  `CREATE TABLE IF NOT EXISTS cms (
    cms_key VARCHAR(64) PRIMARY KEY, published JSON NOT NULL, draft JSON,
    revision INT NOT NULL DEFAULT 0, updated_at BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP())
  ) ${table}`,
  `CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL, company VARCHAR(160) NOT NULL,
    email VARCHAR(254) NOT NULL, phone VARCHAR(80) NOT NULL, category VARCHAR(100) NOT NULL,
    quantity VARCHAR(100) NOT NULL, description TEXT NOT NULL, message TEXT NOT NULL,
    attachment_name VARCHAR(120), attachment MEDIUMBLOB,
    status ENUM('unread','read','closed') NOT NULL DEFAULT 'unread',
    created_at BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP()), updated_at BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP()),
    INDEX(status,created_at), INDEX(created_at)
  ) ${table}`,
  `CREATE TABLE IF NOT EXISTS limits (
    bucket VARCHAR(128) PRIMARY KEY, expires_at BIGINT NOT NULL, attempts INT NOT NULL, INDEX(expires_at)
  ) ${table}`,
  `CREATE TABLE IF NOT EXISTS reset_tokens (
    token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY, administrator_id INT NOT NULL,
    expires_at BIGINT NOT NULL, INDEX(expires_at),
    FOREIGN KEY(administrator_id) REFERENCES administrators(id) ON DELETE CASCADE
  ) ${table}`,
  `CREATE TABLE IF NOT EXISTS media (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY, name VARCHAR(150) NOT NULL,
    alt VARCHAR(300) NOT NULL, bytes MEDIUMBLOB NOT NULL, created_at BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP())
  ) ${table}`,
  `CREATE TABLE IF NOT EXISTS homepage_images (
    image_key VARCHAR(100) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
    original_src VARCHAR(2048) NOT NULL, original_alt VARCHAR(300) NOT NULL,
    current_version CHAR(36) CHARACTER SET ascii COLLATE ascii_bin,
    current_alt VARCHAR(300), revision INT NOT NULL DEFAULT 0,
    updated_by INT, updated_at BIGINT,
    FOREIGN KEY(updated_by) REFERENCES administrators(id)
  ) ${table}`,
  `CREATE TABLE IF NOT EXISTS website_image_pages (
    image_key VARCHAR(100) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
    page_key VARCHAR(100) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    INDEX(page_key),
    FOREIGN KEY(image_key) REFERENCES homepage_images(image_key) ON DELETE CASCADE
  ) ${table}`,
  `CREATE TABLE IF NOT EXISTS homepage_image_versions (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
    image_key VARCHAR(100) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    alt VARCHAR(300) NOT NULL, width INT NOT NULL, height INT NOT NULL,
    file_size INT NOT NULL, updated_by INT NOT NULL,
    created_at BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP()),
    INDEX(image_key,created_at),
    FOREIGN KEY(image_key) REFERENCES homepage_images(image_key),
    FOREIGN KEY(updated_by) REFERENCES administrators(id)
  ) ${table}`,
  `CREATE TABLE IF NOT EXISTS homepage_image_files (
    version_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    width INT NOT NULL, bytes MEDIUMBLOB NOT NULL,
    PRIMARY KEY(version_id,width),
    FOREIGN KEY(version_id) REFERENCES homepage_image_versions(id) ON DELETE CASCADE
  ) ${table}`,
  `CREATE TABLE IF NOT EXISTS app_write_lock (id INT PRIMARY KEY) ${table}`,
  "INSERT INTO app_write_lock(id) VALUES (1) ON DUPLICATE KEY UPDATE id=id",
];
