const path = require('path');
const morgan = require('morgan');

dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));

// Main Route
app.get('/', (req, res) => {
  res.send('RecipeHub API is running...');
});

// Port Configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
