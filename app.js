
require('dotenv').config()
const axios = require('axios');
const express = require('express');
const schedule = require('node-schedule');
const SKURouter = require('./routes/sku.router')
const pool = require('./db')
const app = express();

app.use(express.json());
app.use('/api', SKURouter);
app.get('/', (req, res) => {
  res.send('holla')
})
const PORT = process.env.PORT;
дуе 


const API_TOKEN = process.env.wb_api_token;

const fetchAndSaveSales = async () => {
  try {
    const response = await axios.get('https://statistics-api-sandbox.wildberries.ru/api/v1/supplier/sales', {
      headers: {
        Authorization: API_TOKEN,
        'Content-Type': 'application/json',
      },
      params: {
        dateFrom: '2024-10-24',
      },
    });

    const salesData = response.data;

   
    const insertQuery = `
      INSERT INTO WbData (
        date, lastChangeDate, warehouseName, countryName, oblastOkrugName, regionName, 
        supplierArticle, nmId, barcode, category, subject, brand, techSize, incomeID, 
        isSupply, isRealization, totalPrice, discountPercent, spp, paymentSaleAmount, 
        forPay, finishedPrice, priceWithDisc, saleID, orderType, sticker, gNumber, srid
      ) VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28);
    `;

    const values = salesData.map(data => [
      data.date || null,
      data.lastChangeDate || null,
      data.warehouseName || '',
      data.countryName || '',
      data.oblastOkrugName || '',
      data.regionName || '',
      data.supplierArticle || '',
      data.nmId || null,
      data.barcode || '',
      data.category || '',
      data.subject || '',
      data.brand || '',
      data.techSize || '',
      data.incomeID || null,
      data.isSupply || false,
      data.isRealization || false,
      data.totalPrice || 0,
      data.discountPercent || 0,
      data.spp || 0,
      data.paymentSaleAmount || 0,
      data.forPay || 0,
      data.finishedPrice || 0,
      data.priceWithDisc || 0,
      data.saleID || '',
      data.orderType || '',
      data.sticker || '',
      data.gNumber || '',
      data.srid || '',
    ]);

    const insertPromises = values.map(value => pool.query(insertQuery, value));

    await Promise.all(insertPromises);

    console.log('Данные сохранены в PostgreSQL');
  } catch (error) {
    console.error('Ошибка при получении данных:', error.message);
  }
};

schedule.scheduleJob('0 * * * *', () => {
  console.log('Обновление данных...');
  fetchAndSaveSales();
});


app.listen(PORT, () => {
  console.log('server started on port:' + PORT)
})
