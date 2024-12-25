const pool = require("../db");


class SKUController {
    async getSales(req, res){
        const saleDatas = await pool.query(`SELECT * FROM wbdata`);
        res.json(saleDatas)
    }
}
module.exports = new SKUController();