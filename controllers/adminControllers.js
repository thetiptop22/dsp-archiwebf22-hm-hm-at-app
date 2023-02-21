const Admin = require('../models/adminModel');

// Create a new admin
exports.create = function (req, res) {
    try {
        const admin = new Admin(req.body);
        admin.save(function (err) {
            if (err) res.status(400).send(err);
            else res.json(admin);
        });
    } catch (err) {
        res.status(500).send(err);
    }
};


/**
 * Get Admin By login
 **/
exports.login = function (req,res) {
    try {
        Admin.findOne({email: req.body.email,password: req.body.password},function (err, admin) {
            if (err) throw err;
            else res.json(admin);
        });
    } catch (err) {
        res.status(500).send(err);
    }
}

