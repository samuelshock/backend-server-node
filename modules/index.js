var express = require('express');
var router = express.Router();


router.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        message: 'Peticion realizada correctamente'
    });
});

module.exports = router;