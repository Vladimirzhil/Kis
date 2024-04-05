const express = require('express');
const sql = require('msnodesqlv8');
const app = express();
const connectionString = "server=DESKTOP-5M87H23\\SQLEXPRESS;Database=KIS;trusted_connection=yes;driver={SQL Server Native Client 11.0}"
module.exports = connectionString;

