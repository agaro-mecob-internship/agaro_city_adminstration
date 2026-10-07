<?php
// config.php
// Database configuration and initialization routines for Agaro City Municipal Portal

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'agaro_municipal_db');

function getDB() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }
    
    try {
        $dsn = "mysql:host=" . DB_HOST . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        
        // Auto-create database & tables if they do not exist
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo->exec("USE `" . DB_NAME . "`");
        
        // Initialize tables
        initializeTables($pdo);
        
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}

// Initialize all required tables
function initializeTables($pdo) {
    // Events Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(50) PRIMARY KEY,
        category VARCHAR(50) DEFAULT 'General',
        date DATE NOT NULL,
        time TIME NOT NULL,
        image VARCHAR(255),
        title_en VARCHAR(255) NOT NULL,
        title_om VARCHAR(255) NOT NULL,
        title_am VARCHAR(255) NOT NULL,
        excerpt_en TEXT,
        excerpt_om TEXT,
        excerpt_am TEXT,
        location_en VARCHAR(255),
        location_om VARCHAR(255),
        location_am VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_date (date),
        INDEX idx_category (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    
    // Projects Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(50) PRIMARY KEY,
        category VARCHAR(50) DEFAULT 'General',
        name_en VARCHAR(255) NOT NULL,
        name_om VARCHAR(255) NOT NULL,
        name_am VARCHAR(255) NOT NULL,
        description_en TEXT,
        description_om TEXT,
        description_am TEXT,
        status ENUM('planning', 'ongoing', 'completed') DEFAULT 'planning',
        progress INT DEFAULT 0,
        budget VARCHAR(100),
        manager VARCHAR(255),
        kebele VARCHAR(50),
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_kebele (kebele)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Contact feedback table
    $pdo->exec("CREATE TABLE IF NOT EXISTS contact_feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(255),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_feedback_status (status),
        INDEX idx_feedback_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Gallery and government cabinet image overrides
    $pdo->exec("CREATE TABLE IF NOT EXISTS media_assets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        asset_key VARCHAR(50) NOT NULL UNIQUE,
        asset_type ENUM('gallery', 'government') NOT NULL,
        image VARCHAR(255) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_media_type (asset_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Government office and cabinet details
    $pdo->exec("CREATE TABLE IF NOT EXISTS government_profiles (
        asset_key VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        task TEXT,
        location VARCHAR(255),
        email VARCHAR(255),
        image VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    
    // Insert sample data for projects if table is empty
    $checkStmt = $pdo->query("SELECT COUNT(*) as count FROM projects");
    $count = $checkStmt->fetch()['count'];
    
    if ($count == 0) {
        insertSampleProjects($pdo);
    }
}

// Insert sample project data
function insertSampleProjects($pdo) {
    $sampleProjects = [
        [
            'id' => 'proj-1',
            'category' => 'Infrastructure',
            'name_en' => 'Asphalt Road Construction',
            'name_om' => 'Ijaarsa Daandii Asfaaltii',
            'name_am' => 'የአስፋልት መንገድ ግንባታ',
            'description_en' => 'Construction of 5km asphalt road connecting the city center to industrial zone',
            'description_om' => 'Ijaarsa daandii asfaaltii 5km kan magaalaa wiirtuu naannoo industirii wajjin hidhu',
            'description_am' => 'ከ5 ኪሎ ሜትር የአስፋልት መንገድ ግንባታ የከተማውን መሀል ከኢንዱስትሪ ዞን ጋር የሚያገናኝ',
            'status' => 'ongoing',
            'progress' => 65,
            'budget' => '45,000,000 ETB',
            'manager' => 'Eng. Tarekegn',
            'kebele' => 'Kebele 03'
        ],
        [
            'id' => 'proj-2',
            'category' => 'Health',
            'name_en' => 'Health Center Expansion',
            'name_om' => 'Balbala Fayoobbaa',
            'name_am' => 'የጤና ጣቢያ ማስፋፊያ',
            'description_en' => 'Expansion of health center with 30-bed capacity and modern equipment',
            'description_om' => 'Balbala fayoobbaa kan 30 siree fi meeshaalee ammayyaa',
            'description_am' => 'የ30 አልጋ አቅም እና ዘመናዊ መሳሪያዎች ያሉት የጤና ጣቢያ ማስፋፊያ',
            'status' => 'planning',
            'progress' => 20,
            'budget' => '25,000,000 ETB',
            'manager' => 'Dr. Lemma',
            'kebele' => 'Kebele 07'
        ],
        [
            'id' => 'proj-3',
            'category' => 'Education',
            'name_en' => 'Secondary School Construction',
            'name_om' => 'Ijaarsa Mana Barnoota Sadarkaa Lammaffaa',
            'name_am' => 'የሁለተኛ ደረጃ ትምህርት ቤት ግንባታ',
            'description_en' => 'Construction of modern secondary school for 1500 students',
            'description_om' => 'Ijaarsa mana barnoota sadarkaa lammaffaa kan barattoota 1500',
            'description_am' => 'ለ1500 ተማሪዎች ዘመናዊ የሁለተኛ ደረጃ ትምህርት ቤት ግንባታ',
            'status' => 'ongoing',
            'progress' => 45,
            'budget' => '60,000,000 ETB',
            'manager' => 'Ato Wondimu',
            'kebele' => 'Kebele 12'
        ],
        [
            'id' => 'proj-4',
            'category' => 'Water',
            'name_en' => 'Water Supply System',
            'name_om' => 'Sistimii Bishaanii',
            'name_am' => 'የውሃ አቅርቦት ስርዓት',
            'description_en' => 'Installation of water supply system serving 5000 households',
            'description_om' => 'Sistimii bishaanii mana 5000 tajaajilu',
            'description_am' => '5000 ቤተሰቦችን የሚያገለግል የውሃ አቅርቦት ስርዓት',
            'status' => 'planning',
            'progress' => 10,
            'budget' => '35,000,000 ETB',
            'manager' => 'Eng. Girma',
            'kebele' => 'Kebele 05'
        ],
        [
            'id' => 'proj-5',
            'category' => 'Market',
            'name_en' => 'Modern Market Complex',
            'name_om' => 'Waan Cimaa Guddaa',
            'name_am' => 'ዘመናዊ የገበያ ማዕከል',
            'description_en' => 'Construction of modern market complex with 200 shops',
            'description_om' => 'Waan cimaa guddaa kan dukkanii 200',
            'description_am' => '200 ሱቆች ያሉት ዘመናዊ የገበያ ማዕከል ግንባታ',
            'status' => 'completed',
            'progress' => 100,
            'budget' => '75,000,000 ETB',
            'manager' => 'Ato Mulugeta',
            'kebele' => 'Kebele 08'
        ]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO projects (id, category, name_en, name_om, name_am, description_en, description_om, description_am, status, progress, budget, manager, kebele) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    foreach ($sampleProjects as $project) {
        $stmt->execute([
            $project['id'],
            $project['category'],
            $project['name_en'],
            $project['name_om'],
            $project['name_am'],
            $project['description_en'],
            $project['description_om'],
            $project['description_am'],
            $project['status'],
            $project['progress'],
            $project['budget'],
            $project['manager'],
            $project['kebele']
        ]);
    }
}

// Helper function to check if a table exists
function tableExists($pdo, $tableName) {
    try {
        $stmt = $pdo->prepare("SHOW TABLES LIKE ?");
        $stmt->execute([$tableName]);
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        return false;
    }
}

// Global session helper for keeping selected language active across requests (English, Afan Oromo, Amharic)
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (isset($_GET['lang'])) {
    $lang = $_GET['lang'];
    if (in_array($lang, ['en', 'om', 'am'])) {
        $_SESSION['lang'] = $lang;
    }
}

$currentLang = isset($_SESSION['lang']) ? $_SESSION['lang'] : 'en';

// Helper translations mapping for core UI elements
function t($key, $lang) {
    $dictionary = [
        'nav_home' => ['en' => 'Home', 'om' => 'Mana', 'am' => 'መነሻ ገጽ'],
        'nav_services' => ['en' => 'Services Portal', 'om' => 'Tajaajila', 'am' => 'የአገልግሎት መስኮት'],
        'nav_news' => ['en' => 'News & Events', 'om' => 'Oduu fi Taateewwan', 'am' => 'ዜና እና ዝግጅቶች'],
        'nav_departments' => ['en' => 'Administration', 'om' => 'Koreefi Bulchiinsa', 'am' => 'አስተዳደር'],
        'nav_contact' => ['en' => 'Contact Us', 'om' => 'Quunnamtii', 'am' => 'አግኙን'],
        'nav_admin' => ['en' => 'Executive Admin', 'om' => 'Bulchiinsa', 'am' => 'ሲስተም አስተዳዳሪ'],
        'hero_title' => ['en' => 'Agaro City Administration', 'om' => 'Bulchiinsa Magaalaa Aggaaroo', 'am' => 'የአጋሮ ከተማ አስተዳደር'],
        'hero_subtitle' => ['en' => 'Decentralized Service, Strategic Value Chains, and Citizen Welfare', 'om' => 'Tajaajila Babal\'ataa, Gabaa Bunaa fi Nageenya Hawaasaa', 'am' => 'ቀልጣፋ አገልግሎት፣ የቡና ምርት ወጪ ንግድ እና የህዝብ ደህንነት'],
        'population' => ['en' => 'Population', 'om' => 'Baay\'ina Uummataa', 'am' => 'የሕዝብ ቁጥር'],
        'kebeles' => ['en' => 'Kebeles', 'om' => 'Goxaxxeewwan', 'am' => 'ቀበሌዎች'],
        'elevation' => ['en' => 'Elevation', 'om' => 'Olka\'iinsa Lafa', 'am' => 'ከፍታ'],
        'export' => ['en' => 'Primary Export', 'om' => 'Oomisha Gurguddo', 'am' => 'ዋና ምርት']
    ];
    return isset($dictionary[$key][$lang]) ? $dictionary[$key][$lang] : $key;
}
?>