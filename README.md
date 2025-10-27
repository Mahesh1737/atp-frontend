# 🖨️ ATP - Any Time Printing System

**A modern, cloud-based printing solution using 100% FREE infrastructure**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://netlify.com)

## 🌟 Features

- ✅ **QR Code Session System** - Scan and print instantly
- ✅ **Cloud File Storage** - Cloudinary integration (25GB free)
- ✅ **Secure Payments** - Razorpay test mode
- ✅ **Real-time Updates** - WebSocket support
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Dark Mode** - Beautiful UI with theme toggle
- ✅ **Zero Cost** - Completely free cloud infrastructure

## 🆓 Free Cloud Stack

| Service | Plan | Limits | Cost |
|---------|------|--------|------|
| **Render** | Free Web Service | 750 hrs/mo | $0 |
| **PostgreSQL** | Render Free | 1GB storage | $0 |
| **Cloudinary** | Free | 25GB, 25k transforms/mo | $0 |
| **Netlify** | Free | 100GB bandwidth/mo | $0 |
| **Razorpay** | Test Mode | Unlimited | $0 |
| **Total** | | | **$0/month** 🎉 |

## 🚀 Quick Start

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL (local dev)
- Git

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/atp-printing-system.git
cd atp-printing-system
```

### 2. Setup Backend

```bash
cd atp-printing-service

# Run automated setup
chmod +x setup.sh
./setup.sh

# Or manually create .env (see .env.example)

# Run locally
./mvnw spring-boot:run
```

### 3. Setup Frontend

```bash
cd atp-printing-app

# Install dependencies
npm install

# Create .env (see .env.example)
# VITE_API_BASE_URL=http://localhost:8080
# VITE_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx

# Run locally
npm run dev
```

Visit: http://localhost:5173

## 📦 Project Structure

```
atp-printing-system/
├── atp-printing-service/          # Spring Boot Backend
│   ├── src/main/java/com/atp/printing/
│   │   ├── config/                # Cloudinary, Security, WebSocket
│   │   ├── controller/            # REST endpoints
│   │   ├── entity/                # JPA entities
│   │   ├── repository/            # Data access
│   │   ├── service/               # Business logic
│   │   └── dto/                   # Data transfer objects
│   ├── render.yaml                # Render deployment config
│   └── pom.xml                    # Maven dependencies
│
└── atp-printing-app/              # React Frontend
    ├── src/
    │   ├── pages/                 # Page components
    │   ├── components/            # Reusable components
    │   └── App.jsx                # Main app
    ├── netlify.toml               # Netlify deployment
    └── package.json               # NPM dependencies
```

## 🌐 Deployment

### Backend (Render)

1. **Create accounts:**
   - Cloudinary: https://cloudinary.com
   - Razorpay: https://razorpay.com
   - Render: https://render.com

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Deploy on Render:**
   - New → Web Service
   - Connect GitHub repo
   - Render auto-detects `render.yaml`
   - Add environment variables
   - Deploy!

4. **Your backend:** `https://atp-backend.onrender.com`

### Frontend (Netlify)

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Or connect GitHub:**
   - Netlify Dashboard
   - New site from Git
   - Select repo
   - Build: `npm run build`
   - Publish: `dist`

4. **Your frontend:** `https://atp-print.netlify.app`

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
# Database
DB_URL=jdbc:postgresql://dpg-xxxxx.oregon-postgres.render.com/atpdb
DB_USER=atpuser
DB_PASS=your_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_SECRET=your_secret

# URLs
APP_BASE_URL=https://atp-backend.onrender.com
FRONTEND_URL=https://atp-print.netlify.app
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=https://atp-backend.onrender.com
VITE_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
```

## 📡 API Endpoints

### Public
- `GET /api/health` - Health check
- `POST /api/printer/register` - Register printer
- `POST /api/session/create` - Create session
- `GET /api/session/{id}` - Get session
- `POST /api/upload` - Upload file
- `POST /api/session/{id}/create-order` - Create payment
- `POST /api/session/{id}/payment/complete` - Complete payment

### Protected (JWT)
- `POST /api/printer/status` - Update status
- `POST /api/printer/heartbeat` - Heartbeat

## 🧪 Testing

### Backend Tests
```bash
./mvnw test
```

### Frontend Tests
```bash
npm test
```

### Manual Testing
```bash
# Health check
curl https://atp-backend.onrender.com/api/health

# Register printer
curl -X POST https://atp-backend.onrender.com/api/printer/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HP LaserJet",
    "location": "Building A",
    "pricePerPageBw": 2.50,
    "pricePerPageColor": 5.00,
    "colorSupported": true
  }'
```

## 📊 Monitoring

- **Backend Health**: https://atp-backend.onrender.com/api/health
- **Render Logs**: Dashboard → Your Service → Logs
- **Cloudinary Usage**: https://cloudinary.com/console
- **Database**: Render Dashboard → PostgreSQL

## 🔐 Security

- ✅ HTTPS everywhere (Render + Netlify)
- ✅ JWT authentication for printers
- ✅ CORS properly configured
- ✅ Razorpay signature verification
- ✅ Environment variables for secrets
- ✅ Input validation
- ✅ SQL injection protection (JPA)

## 🐛 Troubleshooting

### Backend not starting
- Check Render logs
- Verify all environment variables set
- Ensure database connected

### File upload fails
- Verify Cloudinary credentials
- Check file size < 10MB
- Validate file type

### CORS errors
- Update `CORS_ALLOWED_ORIGINS` in Render
- Ensure frontend URL matches exactly

### Database connection timeout
- Check PostgreSQL service status
- Verify connection string

## 📚 Documentation

- [Full Deployment Guide](./DEPLOYMENT.md)
- [API Documentation](./API.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Cloudinary for file storage
- Razorpay for payments
- Render for hosting
- Netlify for frontend hosting
- All open source contributors

## 📞 Support

- 📧 Email: support@atp-print.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/atp-printing-system/issues)
- 💬 Discord: [Join Server](https://discord.gg/yourserver)

## 🗺️ Roadmap

- [x] Basic printing functionality
- [x] Cloudinary integration
- [x] Payment gateway
- [x] QR code generation
- [ ] User authentication
- [ ] Print job history
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Multi-printer support
- [ ] Analytics dashboard

---

**⭐ Star this repo if you find it useful!**

**Made with ❤️ using 100% free cloud services**