# MicroPost - Technical Assessment Documentation

This document provides comprehensive answers to all questions from the Siemens technical assessment, along with implementation details for the micro-posting web application.

## Table of Contents

1. [Micro-posting Website](#1-micro-posting-website)
   - [1.1 Background and Requirements](#11-background-and-requirements)
   - [1.2 Architecture](#12-architecture)
   - [1.3 Design and Implementation](#13-design-and-implementation)
   - [1.4 Extend Functionality](#14-extend-functionality)
   - [1.5 Scaling](#15-scaling)
2. [Experience](#2-experience)
   - [2.1 Implementation](#21-implementation)
   - [2.2 JavaScript](#22-javascript)
   - [2.3 SQL](#23-sql)
3. [General](#3-general)

---

## 1. Micro-posting Website

### 1.1 Background and Requirements

This solution implements a micro-posting web application with the following features:

- ✅ Web application with external backend API (via Next.js proxy)
- ✅ MVC architectural pattern
- ✅ RESTful API architecture
- ✅ User login with email and password
- ✅ View list of users in the system
- ✅ View list of a user's posts
- ✅ Create posts with text content
- ✅ Delete user's own posts

---

### 1.2 Architecture

#### What is a RESTful API?

A **RESTful API** (Representational State Transfer) is an architectural style for designing networked applications. It uses HTTP methods to perform CRUD (Create, Read, Update, Delete) operations on resources.

**Key Principles:**

1. **Stateless**: Each request contains all information needed; no session state on server
2. **Client-Server**: Separation of concerns between UI and data storage
3. **Uniform Interface**: Consistent resource identification via URIs
4. **Cacheable**: Responses can be cached for performance
5. **Layered System**: Client doesn't know if connected directly to server

**HTTP Methods:**

- `GET` - Retrieve resources
- `POST` - Create new resources
- `PUT/PATCH` - Update existing resources
- `DELETE` - Remove resources

**Example in this solution:**

```
GET    /api/users           → Get all users
GET    /api/users/:id/posts → Get user's posts
POST   /api/posts           → Create a post
DELETE /api/posts/:id       → Delete a post
```

---

#### What is the MVC Pattern?

**MVC (Model-View-Controller)** is an architectural pattern that separates an application into three interconnected components:

| Component      | Responsibility                                | Implementation in this Project                     |
| -------------- | --------------------------------------------- | -------------------------------------------------- |
| **Model**      | Data logic, API communication, business rules | External backend API via `app/next-proxy/`         |
| **View**       | User interface, presentation layer            | React components in `components/`, pages in `app/` |
| **Controller** | Handles requests, orchestrates Model and View | API routes in `app/api/`                           |

**Flow:**

1. User interacts with View (clicks, types)
2. View sends request to Controller
3. Controller processes request, calls Model
4. Model performs data operations
5. Controller returns data to View
6. View updates UI

---

#### What is Good Software Design?

Good software design encompasses several principles:

1. **SOLID Principles:**

   - **S**ingle Responsibility - Each module has one reason to change
   - **O**pen/Closed - Open for extension, closed for modification
   - **L**iskov Substitution - Subtypes must be substitutable for base types
   - **I**nterface Segregation - Many specific interfaces over one general
   - **D**ependency Inversion - Depend on abstractions, not concretions

2. **DRY (Don't Repeat Yourself):** Avoid code duplication

3. **KISS (Keep It Simple, Stupid):** Simplicity over complexity

4. **Separation of Concerns:** Each component handles one aspect

5. **High Cohesion, Low Coupling:** Related code together, minimal dependencies

6. **Testability:** Easy to write unit and integration tests

7. **Maintainability:** Easy to understand, modify, and extend

8. **Security:** Input validation, authentication, authorization

---

#### High-Level Design Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Login     │  │    Feed     │  │   My Posts  │  │   Users     │        │
│  │    View     │  │    View     │  │    View     │  │    View     │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │                │
│         └────────────────┴────────────────┴────────────────┘                │
│                                   │                                          │
│                         HTTP Requests (REST)                                 │
└─────────────────────────────────────│────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS SERVER                                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        CONTROLLER LAYER                              │    │
│  │                     (API Routes: app/api/)                           │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ /api/auth/*  │  │ /api/posts/* │  │ /api/users/* │               │    │
│  │  │  - login     │  │  - GET all   │  │  - GET all   │               │    │
│  │  │  - logout    │  │  - POST new  │  │  - GET :id   │               │    │
│  │  │  - register  │  │  - DELETE    │  │    /posts    │               │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                   │                                          │
│                                   ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          MODEL LAYER                                 │    │
│  │                     (lib/models.ts)                                  │    │
│  │                                                                      │    │
│  │  ┌──────────────────┐  ┌──────────────────┐                         │    │
│  │  │   User Model     │  │   Post Model     │                         │    │
│  │  │  - loginUser()   │  │  - createPost()  │                         │    │
│  │  │  - getUserById() │  │  - deletePost()  │                         │    │
│  │  │  - getAllUsers() │  │  - getUserPosts()│                         │    │
│  │  └──────────────────┘  └──────────────────┘                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                   │                                          │
│                                   ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        PRISMA ORM                                    │    │
│  │                   (prisma/schema.prisma)                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────│────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATABASE                                          │
│                         (SQLite / PostgreSQL)                                │
│                                                                              │
│  ┌─────────────────────┐      ┌─────────────────────┐                       │
│  │       users         │      │       posts         │                       │
│  │  - id (PK)          │◄────┐│  - id (PK)          │                       │
│  │  - email (unique)   │      │  - content          │                       │
│  │  - password (hash)  │      │  - userId (FK)  ────┘                       │
│  │  - name             │      │  - createdAt        │                       │
│  │  - createdAt        │      │  - updatedAt        │                       │
│  │  - updatedAt        │      └─────────────────────┘                       │
│  └─────────────────────┘                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 1.3 Design and Implementation

#### Models

**What models are required?**

1. **User** - Represents a user in the system
2. **Post** - Represents a micro-post created by a user
3. **PostTranslation** (for extension) - Stores translated versions of posts
4. **SMSImport** (for extension) - Stores imported SMS messages

**How are the models related?**

```
User (1) ──────── (Many) Post
  │                      │
  │                      │
  │              Post (1) ────── (Many) PostTranslation
  │
User (1) ──────── (Many) SMSImport
```

- **User to Post**: One-to-Many (A user can have many posts)
- **Post to PostTranslation**: One-to-Many (A post can have many translations)
- **User to SMSImport**: One-to-Many (A user can import many SMS messages)

#### Model Operations Code (see `lib/models.ts`)

```typescript
// Login with email and password
async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  return user;
}

// Get a user by their identifier
async function getUserById(userId: string) {
  return prisma.user.findUnique({ where: { id: userId } });
}

// Get all of a specific user's posts
async function getUserPosts(userId: string) {
  return prisma.post.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

// Get a specific user's first post
async function getUserFirstPost(userId: string) {
  return prisma.post.findFirst({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });
}

// Create a new post
async function createPost(userId: string, content: string) {
  return prisma.post.create({
    data: { userId, content },
  });
}

// Delete a specific user's post
async function deleteUserPost(postId: string, userId: string) {
  const post = await prisma.post.findFirst({
    where: { id: postId, userId },
  });
  if (!post) return null;
  return prisma.post.delete({ where: { id: postId } });
}
```

---

#### Views (UI Sketches)

**Login View:**

```
┌────────────────────────────────────┐
│         Login to MicroPost         │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Email                        │  │
│  │ you@example.com              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Password                     │  │
│  │ ••••••••                     │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │           LOGIN              │  │
│  └──────────────────────────────┘  │
│                                    │
│  Don't have an account? Register   │
└────────────────────────────────────┘
```

**View All Posts:**

```
┌─────────────────────────────────────────────────┐
│ 📝 MicroPost    Feed  Users  My Posts    [User] │
├─────────────────────────────────────────────────┤
│                                                 │
│  My Posts                                       │
│  Manage your posts                              │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │ What's on your mind?                      │  │
│  │                                   0/280   │  │
│  │                              [Post]       │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │ [JD] John Doe @john   Jan 9, 2026, 2:30PM │  │
│  │                                           │  │
│  │ Just finished building an awesome         │  │
│  │ micro-posting application!                │  │
│  │                                           │  │
│  │ Translate: [Select Language ▼]   [Delete] │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │ [JD] John Doe @john   Jan 8, 2026, 4:15PM │  │
│  │                                           │  │
│  │ Hello world! This is my first post.       │  │
│  │                                           │  │
│  │ Translate: [Select Language ▼]   [Delete] │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Create Post View:**

```
┌───────────────────────────────────────────┐
│ What's on your mind?                      │
│ ┌───────────────────────────────────────┐ │
│ │                                       │ │
│ │ Type your message here...             │ │
│ │                                       │ │
│ └───────────────────────────────────────┘ │
│                              125/280      │
│                                           │
│                              [Post]       │
└───────────────────────────────────────────┘
```

**Delete Post Confirmation:**

```
┌───────────────────────────────────────────┐
│ [JD] John Doe @john                       │
│                                           │
│ This is the post content that will be    │
│ deleted permanently.                      │
│                                           │
│                              [🗑️ Delete]  │
└───────────────────────────────────────────┘
```

---

#### Controllers (RESTful Endpoints)

| Action               | URL                         | HTTP Method | Request Body                                               |
| -------------------- | --------------------------- | ----------- | ---------------------------------------------------------- |
| **Login**            | `/api/auth/login`           | `POST`      | `{ "email": "user@example.com", "password": "secret123" }` |
| **Get User's Posts** | `/api/users/{userId}/posts` | `GET`       | None                                                       |
| **Create New Post**  | `/api/posts`                | `POST`      | `{ "content": "Hello world!" }`                            |
| **Delete Post**      | `/api/posts/{postId}`       | `DELETE`    | None                                                       |

**Example API Calls:**

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secret123"}'

# Get user's posts
curl -X GET http://localhost:3000/api/users/abc123/posts \
  -H "Cookie: auth-token=<jwt-token>"

# Create new post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=<jwt-token>" \
  -d '{"content": "Hello world!"}'

# Delete post
curl -X DELETE http://localhost:3000/api/posts/post123 \
  -H "Cookie: auth-token=<jwt-token>"
```

---

### 1.4 Extend Functionality

#### Translation Capabilities

**How would the solution change to add translation using Amazon Translate?**

1. **Add Translation Service Integration:**

```typescript
// lib/translation.ts
import {
  TranslateClient,
  TranslateTextCommand,
} from '@aws-sdk/client-translate';

const translateClient = new TranslateClient({ region: 'us-east-1' });

const TOP_25_LANGUAGES = [
  { code: 'zh', name: 'Chinese' },
  { code: 'es', name: 'Spanish' },
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'de', name: 'German' },
  { code: 'jv', name: 'Javanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'fr', name: 'French' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'tr', name: 'Turkish' },
  { code: 'ta', name: 'Tamil' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'ur', name: 'Urdu' },
  { code: 'it', name: 'Italian' },
  { code: 'th', name: 'Thai' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pl', name: 'Polish' },
  { code: 'uk', name: 'Ukrainian' },
];

export async function translatePost(postId: string, content: string) {
  for (const lang of TOP_25_LANGUAGES) {
    const command = new TranslateTextCommand({
      Text: content,
      SourceLanguageCode: 'auto',
      TargetLanguageCode: lang.code,
    });

    const result = await translateClient.send(command);

    await prisma.postTranslation.create({
      data: {
        postId,
        languageCode: lang.code,
        languageName: lang.name,
        content: result.TranslatedText,
      },
    });
  }
}
```

2. **Trigger Translation After Post Creation (async/background):**

```typescript
// In POST /api/posts handler
const post = await createPost(userId, content);

// Queue translation job (async - don't block response)
translatePost(post.id, content).catch(console.error);

return NextResponse.json({ post });
```

3. **Add Language Selector to UI:**
   - Already implemented in PostCard component
   - User can select language from dropdown
   - Content updates to show translated version

---

#### SMS Import Capabilities

**How would the solution change to add SMS import?**

1. **Data Model** (already defined):

```prisma
model SMSImport {
  id            String   @id @default(cuid())
  phoneNumber   String
  messageText   String
  sentAt        DateTime
  isFromUser    Boolean
  importedAt    DateTime @default(now())
  convertedToPostId String?
  userId        String
}
```

2. **API Endpoint for Import:**

```typescript
// POST /api/sms/import
export async function POST(request: NextRequest) {
  const session = await getSession();
  const { messages, phoneNumber } = await request.json();

  // Filter for one-on-one conversations only
  const filteredMessages = messages.filter(
    (msg) =>
      msg.participants.length === 2 && msg.participants.includes(phoneNumber)
  );

  await importSMSMessages(session.userId, filteredMessages);

  return NextResponse.json({ success: true });
}
```

3. **Convert SMS to Post:**

```typescript
// POST /api/sms/:smsId/convert
export async function POST(request, { params }) {
  const session = await getSession();
  const post = await convertSMSToPost(params.smsId, session.userId);
  return NextResponse.json({ post });
}
```

4. **Mobile App Integration:**
   - Mobile app would read SMS messages
   - Filter for two-person conversations
   - Send to API in structured format
   - User can select which messages to convert to posts

---

### 1.5 Scaling

#### What does it mean to scale a solution?

**Scaling** means adjusting system resources to handle increased load (more users, more requests, more data) while maintaining performance and reliability.

**Types of Scaling:**

| Type                   | Description                                            | Example                                   |
| ---------------------- | ------------------------------------------------------ | ----------------------------------------- |
| **Vertical Scaling**   | Add more power to existing servers (CPU, RAM, storage) | Upgrade from 4GB to 64GB RAM              |
| **Horizontal Scaling** | Add more servers to distribute load                    | Add more web servers behind load balancer |

---

#### Scaling Options for Micro-Post Solution

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SCALING ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │    CDN      │
                              │ (CloudFront)│
                              │             │
                              │ Static      │
                              │ Assets      │
                              └──────┬──────┘
                                     │
                              ┌──────▼──────┐
                              │   Load      │
                              │  Balancer   │
                              │ (ALB/NLB)   │
                              └──────┬──────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
   ┌──────▼──────┐           ┌──────▼──────┐           ┌──────▼──────┐
   │  Next.js    │           │  Next.js    │           │  Next.js    │
   │  Server 1   │           │  Server 2   │           │  Server N   │
   │             │           │             │           │             │
   │ (Container/ │           │ (Container/ │           │ (Container/ │
   │  K8s Pod)   │           │  K8s Pod)   │           │  K8s Pod)   │
   └──────┬──────┘           └──────┬──────┘           └──────┬──────┘
          │                          │                          │
          └──────────────────────────┼──────────────────────────┘
                                     │
                              ┌──────▼──────┐
                              │   Redis     │
                              │   Cache     │
                              │  (Sessions/ │
                              │   Cache)    │
                              └──────┬──────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
   ┌──────▼──────┐           ┌──────▼──────┐           ┌──────▼──────┐
   │  Primary    │           │   Read      │           │   Read      │
   │  Database   │──────────►│  Replica 1  │           │  Replica 2  │
   │  (RDS)      │           │             │           │             │
   └─────────────┘           └─────────────┘           └─────────────┘
                                                              │
                                                       ┌──────▼──────┐
                                                       │  Background │
                                                       │   Workers   │
                                                       │ (Lambda/ECS)│
                                                       │             │
                                                       │ Translation │
                                                       │   Jobs      │
                                                       └─────────────┘
```

**Component Scaling Strategies:**

| Component            | Scaling Strategy                                                    |
| -------------------- | ------------------------------------------------------------------- |
| **Web Servers**      | Horizontal - Add more containers/pods behind load balancer          |
| **Database**         | Vertical (bigger instance) + Read replicas for read-heavy workloads |
| **Sessions**         | Redis cluster for distributed session storage                       |
| **Static Assets**    | CDN (CloudFront, CloudFlare)                                        |
| **Translation Jobs** | Queue (SQS) + Workers (Lambda/ECS) for async processing             |
| **File Storage**     | S3 for media uploads (if needed)                                    |

---

#### How would you know which parts need to scale?

**Monitoring & Metrics:**

1. **Application Metrics:**

   - Response time (p50, p95, p99)
   - Requests per second (RPS)
   - Error rate
   - CPU/Memory utilization

2. **Database Metrics:**

   - Query latency
   - Connection pool usage
   - Slow query logs
   - Replication lag

3. **Infrastructure Metrics:**
   - CPU utilization per server
   - Memory usage
   - Network I/O
   - Disk I/O

**Tools:**

- AWS CloudWatch / Azure Monitor / GCP Monitoring
- Prometheus + Grafana
- Datadog / New Relic
- Application-level logging

**Scaling Triggers:**

- CPU > 70% sustained → Scale horizontally
- Response time > 500ms p95 → Investigate bottleneck
- Database connections > 80% → Add read replicas or upgrade
- Memory > 85% → Scale vertically or add caching

---

## 2. Experience

### 2.1 Implementation

#### Something I Built and Am Proud Of

_[This section is for the candidate to fill in with their personal experience]_

Example topics to discuss:

- A complex feature or system you designed and implemented
- Challenges overcome during development
- Technologies used and why
- Impact on users or business
- Lessons learned

#### Most Difficult Debugging Experience

_[This section is for the candidate to fill in with their personal experience]_

Framework for discussing:

1. **The Problem**: What was happening? What were the symptoms?
2. **Initial Investigation**: What did you try first?
3. **The Process**: How did you narrow down the issue?
4. **The Root Cause**: What was actually wrong?
5. **The Fix**: How did you resolve it?
6. **Lessons Learned**: What would you do differently?

---

### 2.2 JavaScript

#### Code Analysis

```javascript
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.show-more').forEach(function (element) {
    element.addEventListener('click', function (event) {
      event.preventDefault();
      var hiddenItems = Array.from(
        event.currentTarget.closest('.more-list').querySelectorAll('li.hidden')
      );
      hiddenItems.slice(0, 10).forEach(function (item) {
        item.classList.toggle('hidden');
      });
      if (
        event.currentTarget.closest('.more-list').querySelectorAll('li.hidden')
          .length === 0
      )
        event.currentTarget.style.display = 'none';
    });
  });
});
```

**What This Code Does:**

This code implements a **"Show More" functionality** for lists with hidden items:

1. **Waits for DOM to load** (`DOMContentLoaded`)

2. **Finds all "Show More" buttons** (`.show-more` elements)

3. **Attaches click handlers** to each button that:
   - Prevents default link behavior (`event.preventDefault()`)
   - Finds the parent container (`.more-list`)
   - Gets all hidden list items (`li.hidden`)
   - **Shows the next 10 hidden items** by removing the `hidden` class
   - If no more hidden items remain, **hides the "Show More" button**

**Visual Example:**

```
Before click:                    After click:
┌────────────────────┐          ┌────────────────────┐
│ • Item 1           │          │ • Item 1           │
│ • Item 2           │          │ • Item 2           │
│ • Item 3           │          │ • Item 3           │
│ [Show More]        │          │ • Item 4 (revealed)│
│                    │          │ • Item 5 (revealed)│
│ (Items 4-13 hidden)│          │ • ... 8 more shown │
└────────────────────┘          │ [Show More]        │
                                └────────────────────┘
```

**Use Case:** Pagination/progressive disclosure for long lists (e.g., comments, search results).

---

### 2.3 SQL

#### Query Analysis

```sql
select pl.name, pr.name, prv.name, vdd.fname, vdd.cnt
from release_versions prv
inner join (
  select d.release_version_id as prv_id,
         substring_index(d.source, '/', -1) as fname,
         count(*) as cnt
  from version_downloads d
  group by d.release_version_id, substring_index(d.source, '/', -1)
  having count(*) > 1
) vdd on vdd.prv_id = prv.id
inner join product_releases pr on prv.product_release_id = pr.id
inner join product_line_product_releases plpr on pr.id = plpr.product_release_id
inner join product_lines pl on plpr.product_line_id = pl.id
order by vdd.fname;
```

**What This Query Does:**

This query **finds duplicate file downloads** across product releases:

1. **Subquery (vdd):**

   - Extracts the **filename** from download source paths (`substring_index(d.source, '/', -1)`)
   - Groups downloads by release version and filename
   - **Filters for duplicates** (`HAVING count(*) > 1`)
   - Returns: release_version_id, filename, count

2. **Main Query:**

   - Joins back to get **product hierarchy information**:
     - `release_versions` → specific version
     - `product_releases` → product release
     - `product_lines` → product line

3. **Output:**
   - Product Line Name
   - Product Release Name
   - Release Version Name
   - Filename (duplicated)
   - Count of downloads

**Purpose:** Identify files that have been downloaded multiple times for the same release version, possibly for:

- Detecting popular downloads
- Finding redundant/duplicate downloads
- Analytics on download patterns
- Identifying potential issues with download tracking

**Table Relationships:**

```
product_lines (1) ──── (M) product_line_product_releases
                                    │
                                    └──── (M) product_releases
                                                  │
                                                  └──── (M) release_versions
                                                              │
                                                              └──── (M) version_downloads
```

---

## 3. General

### How do you learn and become proficient in a new technology?

_[This section is for the candidate to fill in with their approach]_

Suggested framework:

1. **Understand the "why"** - What problem does this technology solve?
2. **Official documentation** - Start with tutorials and getting-started guides
3. **Build something small** - Hands-on experience is crucial
4. **Read source code** - Learn patterns from well-written projects
5. **Join the community** - Discord, Stack Overflow, GitHub discussions
6. **Build something real** - Apply to actual projects
7. **Teach others** - Solidifies understanding

---

### How do you learn and become proficient on a team's existing project?

_[This section is for the candidate to fill in with their approach]_

Suggested framework:

1. **Read documentation** - README, architecture docs, ADRs
2. **Set up locally** - Get the project running on your machine
3. **Trace a request** - Follow code from UI to database
4. **Start with small tasks** - Bug fixes, minor features
5. **Ask questions** - Don't struggle alone
6. **Review PRs** - Learn patterns and standards
7. **Document as you learn** - Help future team members

---

### What does being a good team member mean to you?

_[This section is for the candidate to fill in with their perspective]_

Common themes:

- Reliable and accountable
- Clear communication
- Helps others succeed
- Accepts and gives constructive feedback
- Takes ownership
- Respects diverse perspectives
- Continuous improvement mindset

---

### What do you want to learn?

_[This section is for the candidate to fill in with their interests]_

Popular areas in 2024-2026:

- AI/ML integration in applications
- Cloud-native architecture
- Distributed systems
- Performance optimization
- Security best practices
- Leadership and mentoring

---

## Getting Started with this Project

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev

# Seed some test data (optional)
npx prisma db seed

# Start development server
npm run dev
```

### Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (Controllers)
│   ├── feed/              # Feed page
│   ├── login/             # Login page
│   ├── my-posts/          # User's posts page
│   └── users/             # Users list and profile pages
├── components/            # Reusable React components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components (Navbar, etc.)
│   ├── posts/             # Post-related components
│   ├── ui/                # Base UI components
│   └── users/             # User-related components
├── lib/                   # Utility functions
│   ├── auth.ts            # Authentication helpers
│   ├── models.ts          # Data access layer (Model)
│   └── prisma.ts          # Prisma client
└── prisma/                # Database schema and migrations
    └── schema.prisma      # Prisma schema
```
