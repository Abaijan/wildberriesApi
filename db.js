const { Pool } = require('pg');

const pool = new Pool({
    user: 'customermac',
    database: 'wildberries',
    password: 'user',
    port: 8080, 
  });


(async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log('Подключение к PostgreSQL установлено.');


    const createTableQuery = 
  `
    CREATE TABLE IF NOT EXISTS WbData (
  date TIMESTAMP NOT NULL,
  lastChangeDate TIMESTAMP NOT NULL,
  warehouseName VARCHAR(255),
  countryName VARCHAR(255),
  oblastOkrugName VARCHAR(255),
  regionName VARCHAR(255),
  supplierArticle VARCHAR(50),
  nmId BIGINT,
  barcode VARCHAR(50),
  category VARCHAR(255),
  subject VARCHAR(255),
  brand VARCHAR(255),
  techSize VARCHAR(50),
  incomeID BIGINT,
  isSupply BOOLEAN,
  isRealization BOOLEAN,
  totalPrice FLOAT,
  discountPercent INT,
  spp FLOAT,
  paymentSaleAmount FLOAT,
  forPay FLOAT,
  finishedPrice FLOAT,
  priceWithDisc FLOAT,
  saleID VARCHAR(50),
  orderType VARCHAR(255),
  sticker VARCHAR(255),
  gNumber VARCHAR(255),
  srid VARCHAR(255)
);`;


    await pool.query(createTableQuery);
    console.log('Таблица синхронизирована.');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error.message);
  }
})();
module.exports = pool;