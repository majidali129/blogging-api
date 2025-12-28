
import express  from 'express';
import { config } from './config/index.js'
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import { appRouter } from './routes/index.js';
import { globalErrorHandler } from './middleware/globar-error-handler.js';


const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        
        if (config.ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
        
        else throw new Error(`CORS ERROR: Origin ${origin} not allowed by CORS`);
    }
};


const app = express();




    (() => {
    
        app.use(cors(corsOptions)).use(express.json()).use(express.urlencoded({ extended: true })).use(cookieParser());

        app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'OK',
                message: 'Server is healthy',
                path: req.originalUrl
            })
        })

        app.use('/api', appRouter)


        // GLOBAL ERROR HANDLER
        app.use(globalErrorHandler)

        app.listen(config.PORT, () => {
            console.log(`App is listening at port: ${config.PORT}`)
        })
} )()