#  Backend System: Social Content Moderation Platform - #dobreslowa

## Project Overview
A sophisticated NestJS backend for a social media platform with advanced content moderation features, role-based access control, and real-time interaction capabilities.

## Technical Highlights

### 🔐 Authentication System
- **JWT-like Token Management**: Custom access token implementation with SHA-256 hashing
- **Automatic Token Expiration**: 10-minute session timeout with background cleanup
- **Secure Password Handling**: bcrypt with 10 salt rounds for robust encryption
- **Multi-factor Session Management**: Cookie-based user sessions with token validation

### 🏗️ Modular Architecture
- **NestJS Framework**: Enterprise-grade TypeScript backend structure
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **Role-Based Access Control (RBAC)**: Multi-level permission system (User, Verifier, Admin, Developer)
- **Swagger API Documentation**: Auto-generated OpenAPI specifications

### 📝 Content Management Engine
- **Post & Comment System**: Full CRUD operations with real-time interactions
- **Advanced Moderation Workflow**: Three-tier verification system (pending/verified/declined)
- **Like/Unlike Functionality**: Atomic operations with anti-duplication safeguards
- **Content Filtering**: Role-based visibility for sensitive content

### 🎯 Features
- **Role Hierarchy System**: 
  - Developer privileges (full access)
  - Administrator rights (content management)
  - Verifier role (content moderation)
  - Standard user (basic interactions)

- **Real-time Validation**: Token expiration checks on every protected endpoint
- **Data Integrity**: UUIDv4 for all entity identifiers
- **Input Validation**: Class-validator DTOs with comprehensive sanitization

## Technical Implementation
- **RESTful API Design**: Clean endpoint structure with proper HTTP methods
- **Global Exception Handling**: Custom error responses with appropriate status codes
- **CORS Configuration**: Secure cross-origin resource sharing
- **Validation Pipes**: Automatic request validation and transformation
- **Testing Ready**: Jasmine test suite configuration for all modules

## Security & Performance
- **Middleware Protection**: Authentication guards on all sensitive routes
- **Token Refresh Mechanism**: Secure token rotation without re-authentication
- **Optimized Queries**: Efficient database operations with proper indexing
- **Scalable Design**: Modular architecture supporting future feature expansion
