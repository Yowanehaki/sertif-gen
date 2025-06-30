import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';

const app = express();


app.listen(5000,   () => {
  console.log('Server is running on port 5000');
});