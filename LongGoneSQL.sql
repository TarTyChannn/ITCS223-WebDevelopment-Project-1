-- ============================================================
-- SQL Script generated from Web_Dev_Data_Dictionary.xlsx
-- (Corrected Version)
-- ============================================================

-- Create and select the database
-- Drop the database if it already exists to start fresh
DROP DATABASE IF EXISTS long_gone_db;

-- Create and select the database
CREATE DATABASE long_gone_db;
USE long_gone_db;

-- ============================================================
-- 1. HouseCategory (no dependencies)
-- ... (rest of the script remains exactly the same)

-- 1. HouseCategory (no dependencies)
CREATE TABLE HouseCategory (
    categoryID   CHAR(8)        NOT NULL,
    CategoryName VARCHAR(50)    NOT NULL,
    description  VARCHAR(2000)  NULL,
    createdDate  DATE           NOT NULL,
    CONSTRAINT PK_HouseCategory PRIMARY KEY (categoryID)
);

-- 2. Area (no dependencies)
CREATE TABLE Area (
    AreaName    VARCHAR(50)  NOT NULL,
    Province    VARCHAR(50)  NOT NULL,
    District    VARCHAR(50)  NOT NULL,
    Subdistrict VARCHAR(50)  NOT NULL,
    Zipcode     VARCHAR(50)  NOT NULL,
    CONSTRAINT PK_Area PRIMARY KEY (AreaName)
);

-- 3. House (depends on HouseCategory, Area)
CREATE TABLE House (
    HouseID       CHAR(11)       NOT NULL,
    HouseName     VARCHAR(50)    NOT NULL,
    HousePrice    DECIMAL(10,2)  NOT NULL CHECK (HousePrice >= 0),
    bedroomCount  INT            NOT NULL CHECK (bedroomCount  BETWEEN 0 AND 20),
    bathroomCount INT            NOT NULL CHECK (bathroomCount BETWEEN 0 AND 20),
    basementCount INT            NOT NULL CHECK (basementCount BETWEEN 0 AND 5),
    Description   VARCHAR(2000)  NULL,
    HcategoryID   CHAR(8)        NOT NULL, -- FIXED: Was INT, now matches HouseCategory.categoryID
    HAreaName     VARCHAR(50)    NOT NULL, -- FIXED: Was VARCHAR(100), now matches Area.AreaName
    CONSTRAINT PK_House PRIMARY KEY (HouseID),
    CONSTRAINT FK_House_HouseCategory FOREIGN KEY (HcategoryID)
        REFERENCES HouseCategory (categoryID),
    CONSTRAINT FK_House_Area FOREIGN KEY (HAreaName)
        REFERENCES Area (AreaName)
);

-- 4. Photo (depends on House)
CREATE TABLE Photo (
    PhotoID      CHAR(8)        NOT NULL CHECK (PhotoID > '0'),
    Pdescription VARCHAR(2000)  NULL,
    PhotoRef     VARCHAR(6000)  NOT NULL,
    PHouseID     CHAR(11)       NOT NULL, -- FIXED: Was INT, now matches House.HouseID
    CONSTRAINT PK_Photo PRIMARY KEY (PhotoID),
    CONSTRAINT FK_Photo_House FOREIGN KEY (PHouseID)
        REFERENCES House (HouseID)
);

-- 5. Customer (no dependencies)
CREATE TABLE Customer (
    CustomerID          CHAR(10)    NOT NULL CHECK (CustomerID > '0'),
    CName               VARCHAR(50) NOT NULL,
    CustomerGmail       VARCHAR(50) NOT NULL,
    CustomerPhoneNumber VARCHAR(20) NOT NULL,
    CONSTRAINT PK_Customer PRIMARY KEY (CustomerID)
);

-- 6. Admin (no dependencies)
CREATE TABLE Admin (
    AdminID          CHAR(10)       NOT NULL CHECK (AdminID > '0'),
    Aname            VARCHAR(50)    NOT NULL,
    AdminGmail       VARCHAR(50)    NOT NULL,
    AdminPhoneNumber VARCHAR(12)    NOT NULL,
    Salary           DECIMAL(10,2)  NOT NULL,
    Password         VARCHAR(255)   NOT NULL,
    CONSTRAINT PK_Admin PRIMARY KEY (AdminID)
);

-- 7. AdminAccount (depends on Admin)
CREATE TABLE AdminAccount (
    AdminAccID          CHAR(10)    NOT NULL,
    AdminAccName        VARCHAR(50) NOT NULL,
    AdminAccGmail       VARCHAR(50) NOT NULL,
    AdminAccPhoneNumber VARCHAR(12) NOT NULL,
    ACAdminID           CHAR(10)    NOT NULL,
    CONSTRAINT PK_AdminAccount PRIMARY KEY (AdminAccID),
    CONSTRAINT FK_AdminAccount_Admin FOREIGN KEY (ACAdminID)
        REFERENCES Admin (AdminID)
);

-- 8. HouseBroker (depends on Admin)
CREATE TABLE HouseBroker (
    HBID          CHAR(11)       NOT NULL,
    HBname        VARCHAR(50)    NOT NULL,
    HBPhoneNumber VARCHAR(12)    NOT NULL,
    HBGmail       VARCHAR(50)    NOT NULL,
    Wage          DECIMAL(10,2)  NOT NULL,
    HBAdminID     CHAR(10)       NOT NULL,
    CONSTRAINT PK_HouseBroker PRIMARY KEY (HBID),
    CONSTRAINT FK_HouseBroker_Admin FOREIGN KEY (HBAdminID)
        REFERENCES Admin (AdminID)
);

-- 9. Rating (depends on Customer, House) — composite PK
CREATE TABLE Rating (
    RCustomerID  CHAR(10)      NOT NULL,
    RHouseID     CHAR(11)      NOT NULL,
    RatingValue  DECIMAL(3,2)  NOT NULL, -- FIXED: Was CHAR(11). Changed to DECIMAL so you can calculate AVG() in Node.js
    Date         DATE          NOT NULL,
    CONSTRAINT PK_Rating PRIMARY KEY (RCustomerID, RHouseID),
    CONSTRAINT FK_Rating_Customer FOREIGN KEY (RCustomerID)
        REFERENCES Customer (CustomerID),
    CONSTRAINT FK_Rating_House FOREIGN KEY (RHouseID)
        REFERENCES House (HouseID)
);

-- 10. Manage (depends on AdminAccount, House) — composite PK
CREATE TABLE Manage (
    MAdminAccID  CHAR(10)    NOT NULL,
    MHouseID     CHAR(11)    NOT NULL,
    UpdateDate   DATE        NOT NULL,
    UpdateType   VARCHAR(20) NOT NULL,
    CONSTRAINT PK_Manage PRIMARY KEY (MAdminAccID, MHouseID),
    CONSTRAINT FK_Manage_AdminAccount FOREIGN KEY (MAdminAccID)
        REFERENCES AdminAccount (AdminAccID),
    CONSTRAINT FK_Manage_House FOREIGN KEY (MHouseID)
        REFERENCES House (HouseID)
);

-- 11. Contain (depends on House, HouseCategory) — composite PK
CREATE TABLE Contain (
    CHouseID    CHAR(11)  NOT NULL,
    CcategoryID CHAR(8)   NOT NULL,
    UpdatedDate DATE      NOT NULL,
    CONSTRAINT PK_Contain PRIMARY KEY (CHouseID, CcategoryID),
    CONSTRAINT FK_Contain_House FOREIGN KEY (CHouseID)
        REFERENCES House (HouseID),
    CONSTRAINT FK_Contain_HouseCategory FOREIGN KEY (CcategoryID)
        REFERENCES HouseCategory (categoryID)
);

-- 12. RequestViewing (depends on Customer, House) — composite PK
CREATE TABLE RequestViewing (
    VCustomerID  CHAR(10)  NOT NULL,
    VHouseID     CHAR(11)  NOT NULL,
    RequestDate  DATE      NOT NULL,
    CONSTRAINT PK_RequestViewing PRIMARY KEY (VCustomerID, VHouseID),
    CONSTRAINT FK_RequestViewing_Customer FOREIGN KEY (VCustomerID)
        REFERENCES Customer (CustomerID),
    CONSTRAINT FK_RequestViewing_House FOREIGN KEY (VHouseID)
        REFERENCES House (HouseID)
);

-- ============================================================
-- End of script
-- ============================================================