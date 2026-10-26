Development Checklist

1. Authentication & Authorization

- [ ] Set up auth folder structure
- [ ] Create Staff/User database model
- [ ] Create registration schema
- [ ] Create login schema
- [ ] Implement password hashing
- [ ] Implement staff registration
- [ ] Implement staff login
- [ ] Implement JWT generation
- [ ] Store JWT in HTTP-only cookie
- [ ] Create authentication middleware
- [ ] Create authorization/role middleware
- [ ] Implement logout
- [ ] Protect private routes
- [ ] Test authentication
- [ ] Test role-based authorization

2. Intern Management

- [ ] Create Intern database model
- [ ] Create intern validation schemas
- [ ] Implement create intern
- [ ] Implement get all interns
- [ ] Implement get single intern
- [ ] Implement update intern
- [ ] Implement activate/deactivate intern
- [ ] Implement search/filtering
- [ ] Implement intern PIN creation/reset
- [ ] Hash intern PIN before storing
- [ ] Apply role-based permissions
- [ ] Test all intern endpoints
- [ ] Test validation and error cases

Development Order

Authentication → Authorization → Intern Model → Intern CRUD → PIN → Search/Filtering → Testing
