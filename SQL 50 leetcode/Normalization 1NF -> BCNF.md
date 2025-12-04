# **Database Normalization** 📊

**Normalization** is a systematic process of **organizing data** in a database to **eliminate redundancy**, **reduce anomalies**, and **ensure data integrity**.

## 🎯 **Why Normalize?**
```
❌ Problems with UNNORMALIZED data:
├── Data Redundancy (wasted storage)
├── Insert/Update/Delete Anomalies
└── Inconsistent data
```

## **Normal Forms** (Progressive Rules) 🏗️

| **Normal Form** | **Rule** | **Example** |
|-----------------|----------|-------------|
| **1NF** | Atomic values, no repeating groups | Split multi-value fields |
| **2NF** | 1NF + No partial dependencies | Move non-key attributes |
| **3NF** | 2NF + No transitive dependencies | Eliminate indirect dependencies |
| **BCNF** | Stronger 3NF | Every determinant is a candidate key |

## **Practical Example** 🚀

### **Before Normalization** (Unnormalized)
```sql
-- Student_Courses Table (❌ BAD)
CREATE TABLE Student_Courses (
    StudentID, StudentName, CourseID, CourseName, Instructor, Grade
);
-- Data: Duplication everywhere!
```
```
StudentID | StudentName | CourseID | CourseName    | Instructor | Grade
1         | John        | 101      | Databases     | Prof.Smith | A
1         | John        | 102      | Algorithms    | Prof.Lee   | B
2         | Jane        | 101      | Databases     | Prof.Smith | B
```

**Problems:**
- **Redundancy**: "John", "Databases", "Prof.Smith" repeated
- **Update Anomaly**: Change Smith's name in one place → inconsistency
- **Delete Anomaly**: Delete Jane's record → lose "Databases" info

### **After 3NF Normalization** ✅

```sql
-- 1. Students Table
CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    StudentName VARCHAR(50)
);

-- 2. Courses Table  
CREATE TABLE Courses (
    CourseID INT PRIMARY KEY,
    CourseName VARCHAR(50),
    Instructor VARCHAR(50)
);

-- 3. Enrollments Table (junction)
CREATE TABLE Enrollments (
    StudentID INT,
    CourseID INT,
    Grade CHAR(1),
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);
```

**Normalized Data:**
```
Students table:           Courses table:                 Enrollments table:
  StudentID↑          CourseID↑  CourseName          StudentID↑  CourseID↑   Grade
  1  John              101    Databases               1            101         A
  2  Jane              102    Algorithms              1            102         B
                       103    Networks                2            101         B
```


## **JOIN to Get Original View** 🔗
```sql
SELECT s.StudentName, c.CourseName, c.Instructor, e.Grade
FROM Students s
JOIN Enrollments e ON s.StudentID = e.StudentID
JOIN Courses c ON e.CourseID = c.CourseID;
```

## **Benefits** ✅
```
✅ No redundancy = Less storage
✅ No anomalies = Reliable updates
✅ Referential Integrity = Valid data
✅ Easier maintenance
```

## **When to Denormalize?** ⚠️
```
Performance-critical apps
- Data Warehouses
- Read-heavy systems
- Real-time reporting

Strategy: Normalize → Query → Denormalize for cache/reporting
```

**Rule of Thumb:** **Normalize to 3NF** for most applications! 🎯

**Normalization = Data Integrity + Efficiency** 💾


---
---


# **Step-by-Step Normalization: 1NF → BCNF** 📊
---

## **📌 Starting Point: Unnormalized (UNF)**

```
┌─────────┬─────────────┬─────────────────────────────────────────────────────┐
│StudentID│ StudentName │                    Courses                          │
├─────────┼─────────────┼─────────────────────────────────────────────────────┤
│    1    │    John     │ (101, Databases, Prof.Smith, A),                    │
│         │             │ (102, Algorithms, Prof.Lee, B)                      │
├─────────┼─────────────┼─────────────────────────────────────────────────────┤
│    2    │    Jane     │ (101, Databases, Prof.Smith, B)                     │
└─────────┴─────────────┴─────────────────────────────────────────────────────┘
```

**❌ Problems:**
- Multi-valued attributes (Courses column has multiple values)
- Repeating groups
- Not atomic

---

## **🔹 STEP 1: First Normal Form (1NF)**

### **📜 Rule:**
```
✅ Each cell must contain ATOMIC (single, indivisible) values
✅ No repeating groups or arrays
✅ Each row must be unique (define a Primary Key)
✅ Each column must have a unique name
```

### **🔧 Action:**
Split the multi-valued "Courses" column into separate rows with atomic values.

### **Before → After:**

```
BEFORE (UNF):                          AFTER (1NF):
┌────┬──────┬──────────────────┐       ┌────┬──────┬─────┬───────────┬───────────┬─────┐
│ ID │ Name │     Courses      │       │ ID │ Name │CrsID│ CrsName   │Instructor │Grade│
├────┼──────┼──────────────────┤       ├────┼──────┼─────┼───────────┼───────────┼─────┤
│ 1  │ John │ 101-DB-Smith-A,  │  ──►  │ 1  │ John │ 101 │ Databases │Prof.Smith │  A  │
│    │      │ 102-Algo-Lee-B   │       │ 1  │ John │ 102 │ Algorithms│Prof.Lee   │  B  │
├────┼──────┼──────────────────┤       │ 2  │ Jane │ 101 │ Databases │Prof.Smith │  B  │
│ 2  │ Jane │ 101-DB-Smith-B   │       └────┴──────┴─────┴───────────┴───────────┴─────┘
└────┴──────┴──────────────────┘
```

### **1NF Table:**

```
┌───────────┬─────────────┬──────────┬────────────┬────────────┬───────┐
│StudentID  │ StudentName │ CourseID │ CourseName │ Instructor │ Grade │
├───────────┼─────────────┼──────────┼────────────┼────────────┼───────┤
│     1     │    John     │   101    │ Databases  │ Prof.Smith │   A   │
│     1     │    John     │   102    │ Algorithms │ Prof.Lee   │   B   │
│     2     │    Jane     │   101    │ Databases  │ Prof.Smith │   B   │
└───────────┴─────────────┴──────────┴────────────┴────────────┴───────┘

🔑 Primary Key: (StudentID, CourseID) - Composite Key
```

### **SQL:**
```sql
CREATE TABLE Student_Courses_1NF (
    StudentID INT,
    StudentName VARCHAR(50),
    CourseID INT,
    CourseName VARCHAR(50),
    Instructor VARCHAR(50),
    Grade CHAR(1),
    PRIMARY KEY (StudentID, CourseID)
);

INSERT INTO Student_Courses_1NF VALUES
(1, 'John', 101, 'Databases', 'Prof.Smith', 'A'),
(1, 'John', 102, 'Algorithms', 'Prof.Lee', 'B'),
(2, 'Jane', 101, 'Databases', 'Prof.Smith', 'B');
```

### **✅ 1NF Checklist:**
```
✅ Atomic values in each cell
✅ No repeating groups
✅ Primary key defined: (StudentID, CourseID)
✅ Unique column names
```

### **❌ Remaining Problems (for 2NF):**
```
Look at the functional dependencies:

Primary Key: (StudentID, CourseID)

Dependencies:
├── StudentID → StudentName              ❌ PARTIAL (depends on PART of PK)
├── CourseID → CourseName, Instructor    ❌ PARTIAL (depends on PART of PK)  
└── (StudentID, CourseID) → Grade        ✅ FULL (depends on ENTIRE PK)

PARTIAL DEPENDENCIES violate 2NF!
```

---

## **🔹 STEP 2: Second Normal Form (2NF)**

### **📜 Rule:**
```
✅ Must be in 1NF
✅ NO partial dependencies
   (All non-key attributes must depend on the ENTIRE primary key,
    not just part of it)
```

### **🔍 Identify Partial Dependencies:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FUNCTIONAL DEPENDENCY ANALYSIS                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Primary Key: (StudentID, CourseID)                                         │
│                                                                             │
│  ┌─────────────────────┬──────────────────────┬─────────────────────────┐   │
│  │     Dependency      │        Type          │        Problem?         │   │
│  ├─────────────────────┼──────────────────────┼─────────────────────────┤   │
│  │StudentID→StudentName│ PARTIAL (part of PK) │ ❌ Violates 2NF         │   │
│  │CourseID→CourseName  │ PARTIAL (part of PK) │ ❌ Violates 2NF         │   │
│  │CourseID→Instructor  │ PARTIAL (part of PK) │ ❌ Violates 2NF         │   │
│  │(SID,CID)→Grade      │ FULL (entire PK)     │ ✅ OK                   │   │
│  └─────────────────────┴──────────────────────┴─────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **🔧 Action:**
Decompose the table to remove partial dependencies.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DECOMPOSITION TO 2NF                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Original: Student_Courses_1NF                                              │
│  ┌─────────┬──────┬─────────┬───────────┬────────────┬───────┐              │
│  │StudentID│ Name │CourseID │CourseName │ Instructor │ Grade │              │
│  └────┬────┴──┬───┴────┬────┴─────┬─────┴──────┬─────┴───┬───┘              │
│       │       │        │          │            │         │                  │
│       │       │        │          │            │         │                  │
│  ┌────▼───────▼──┐ ┌───▼──────────▼────────────▼───┐ ┌───▼─────────────┐    │
│  │   STUDENTS    │ │         COURSES               │ │   ENROLLMENTS   │    │
│  │               │ │                               │ │                 │    │
│  │ StudentID→    │ │ CourseID→CourseName           │ │(StudentID,      │    │
│  │ StudentName   │ │ CourseID→Instructor           │ │ CourseID)→Grade │    │
│  └───────────────┘ └───────────────────────────────┘ └─────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **2NF Tables:**

```
TABLE 1: Students
┌─────────────┬─────────────┐
│ StudentID*  │ StudentName │
├─────────────┼─────────────┤
│      1      │    John     │
│      2      │    Jane     │
└─────────────┴─────────────┘
🔑 PK: StudentID
📌 Dependency: StudentID → StudentName ✅


TABLE 2: Courses
┌──────────┬────────────┬────────────┐
│CourseID* │ CourseName │ Instructor │
├──────────┼────────────┼────────────┤
│   101    │ Databases  │ Prof.Smith │
│   102    │ Algorithms │ Prof.Lee   │
└──────────┴────────────┴────────────┘
🔑 PK: CourseID
📌 Dependency: CourseID → CourseName, Instructor ✅


TABLE 3: Enrollments
┌─────────────┬──────────┬───────┐
│ StudentID*  │CourseID* │ Grade │
├─────────────┼──────────┼───────┤
│      1      │   101    │   A   │
│      1      │   102    │   B   │
│      2      │   101    │   B   │
└─────────────┴──────────┴───────┘
🔑 PK: (StudentID, CourseID)
📌 Dependency: (StudentID, CourseID) → Grade ✅
```

### **SQL:**
```sql
-- Table 1: Students
CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    StudentName VARCHAR(50) NOT NULL
);

INSERT INTO Students VALUES
(1, 'John'),
(2, 'Jane');

-- Table 2: Courses
CREATE TABLE Courses (
    CourseID INT PRIMARY KEY,
    CourseName VARCHAR(50) NOT NULL,
    Instructor VARCHAR(50) NOT NULL
);

INSERT INTO Courses VALUES
(101, 'Databases', 'Prof.Smith'),
(102, 'Algorithms', 'Prof.Lee');

-- Table 3: Enrollments
CREATE TABLE Enrollments (
    StudentID INT,
    CourseID INT,
    Grade CHAR(1),
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

INSERT INTO Enrollments VALUES
(1, 101, 'A'),
(1, 102, 'B'),
(2, 101, 'B');
```

### **✅ 2NF Checklist:**
```
✅ In 1NF
✅ No partial dependencies
✅ All non-key attributes depend on ENTIRE primary key
```

### **❌ Remaining Problems (for 3NF):**
```
Let's add a realistic scenario:
Each Instructor belongs to a Department

New Courses Table:
┌──────────┬────────────┬────────────┬────────────┐
│CourseID* │ CourseName │ Instructor │ Department │
├──────────┼────────────┼────────────┼────────────┤
│   101    │ Databases  │ Prof.Smith │     CS     │
│   102    │ Algorithms │ Prof.Lee   │     CS     │
│   103    │ Networks   │ Prof.Khan  │     IT     │
└──────────┴────────────┴────────────┴────────────┘

Dependencies:
├── CourseID → Instructor    ✅ (key → non-key)
├── Instructor → Department  ❌ TRANSITIVE! (non-key → non-key)
└── Therefore: CourseID → Instructor → Department

This is a TRANSITIVE DEPENDENCY!
```

---

## **🔹 STEP 3: Third Normal Form (3NF)**

### **📜 Rule:**
```
✅ Must be in 2NF
✅ NO transitive dependencies
   (Non-key attribute should NOT depend on another non-key attribute)
```

### **🔍 Identify Transitive Dependency:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TRANSITIVE DEPENDENCY ANALYSIS                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Courses Table (2NF):                                                       │
│  ┌──────────┬────────────┬────────────┬────────────┐                        │
│  │CourseID* │ CourseName │ Instructor │ Department │                        │
│  ├──────────┼────────────┼────────────┼────────────┤                        │
│  │   101    │ Databases  │ Prof.Smith │     CS     │                        │
│  │   102    │ Algorithms │ Prof.Lee   │     CS     │                        │
│  │   103    │ Networks   │ Prof.Khan  │     IT     │                        │
│  │   104    │ AI/ML      │ Prof.Smith │     CS     │ ← Smith repeated!      │
│  └──────────┴────────────┴────────────┴────────────┘                        │
│                                                                             │
│  Transitive Dependency Chain:                                               │
│                                                                             │
│       CourseID ──────► Instructor ──────► Department                        │
│          │                  │                  │                            │
│         KEY              NON-KEY            NON-KEY                         │
│                             │                  │                            │
│                             └────── depends ───┘                            │
│                                  on each other                              │
│                                                                             │
│  Problem: Department depends on Instructor, NOT directly on CourseID        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **Why is this bad?**
```
❌ Redundancy: "Prof.Smith → CS" stored multiple times
❌ Update Anomaly: If Smith changes department, must update ALL rows
❌ Insert Anomaly: Can't add new instructor without a course
❌ Delete Anomaly: Deleting last course of instructor loses department info
```

### **🔧 Action:**
Remove the transitive dependency by creating a separate table.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DECOMPOSITION TO 3NF                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  BEFORE (2NF - with transitive dependency):                                 │
│  ┌──────────┬────────────┬────────────┬────────────┐                        │
│  │CourseID* │ CourseName │ Instructor │ Department │                        │
│  └──────────┴────────────┴─────┬──────┴──────┬─────┘                        │
│                                │             │                              │
│                     ┌──────────┴─────────────┘                              │
│                     │  Extract to new table                                 │
│                     ▼                                                       │
│                                                                             │
│  AFTER (3NF):                                                               │
│                                                                             │
│  ┌──────────┬────────────┬────────────┐    ┌────────────┬────────────┐      │
│  │CourseID* │ CourseName │ Instructor │    │Instructor* │ Department │      │
│  │          │            │    (FK)    │    │            │            │      │
│  └──────────┴────────────┴─────┬──────┘    └──────▲─────┴────────────┘      │
│                                │                  │                         │
│                                └──────────────────┘                         │
│                                   Foreign Key                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **3NF Tables:**

```
TABLE 1: Students (unchanged)
┌─────────────┬─────────────┐
│ StudentID*  │ StudentName │
├─────────────┼─────────────┤
│      1      │    John     │
│      2      │    Jane     │
└─────────────┴─────────────┘
🔑 PK: StudentID


TABLE 2: Instructors (NEW!)
┌──────────────┬────────────┐
│ Instructor*  │ Department │
├──────────────┼────────────┤
│  Prof.Smith  │     CS     │
│  Prof.Lee    │     CS     │
│  Prof.Khan   │     IT     │
└──────────────┴────────────┘
🔑 PK: Instructor
📌 Dependency: Instructor → Department ✅ (key → non-key)


TABLE 3: Courses (modified)
┌──────────┬────────────┬────────────┐
│CourseID* │ CourseName │ Instructor │
├──────────┼────────────┼────────────┤
│   101    │ Databases  │ Prof.Smith │ (FK)
│   102    │ Algorithms │ Prof.Lee   │ (FK)
│   103    │ Networks   │ Prof.Khan  │ (FK)
│   104    │ AI/ML      │ Prof.Smith │ (FK)
└──────────┴────────────┴────────────┘
🔑 PK: CourseID
📌 Dependency: CourseID → CourseName, Instructor ✅


TABLE 4: Enrollments (unchanged)
┌─────────────┬──────────┬───────┐
│ StudentID*  │CourseID* │ Grade │
├─────────────┼──────────┼───────┤
│      1      │   101    │   A   │
│      1      │   102    │   B   │
│      2      │   101    │   B   │
└─────────────┴──────────┴───────┘
🔑 PK: (StudentID, CourseID)
```

### **SQL:**
```sql
-- Table 1: Students (unchanged)
CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    StudentName VARCHAR(50) NOT NULL
);

-- Table 2: Instructors (NEW)
CREATE TABLE Instructors (
    Instructor VARCHAR(50) PRIMARY KEY,
    Department VARCHAR(50) NOT NULL
);

INSERT INTO Instructors VALUES
('Prof.Smith', 'CS'),
('Prof.Lee', 'CS'),
('Prof.Khan', 'IT');

-- Table 3: Courses (modified - removed Department)
CREATE TABLE Courses (
    CourseID INT PRIMARY KEY,
    CourseName VARCHAR(50) NOT NULL,
    Instructor VARCHAR(50),
    FOREIGN KEY (Instructor) REFERENCES Instructors(Instructor)
);

INSERT INTO Courses VALUES
(101, 'Databases', 'Prof.Smith'),
(102, 'Algorithms', 'Prof.Lee'),
(103, 'Networks', 'Prof.Khan'),
(104, 'AI/ML', 'Prof.Smith');

# **Continuing from Table 4: Enrollments...**

### **Table 4: Enrollments (unchanged)**
```
┌─────────────┬──────────┬───────┐
│ StudentID*  │CourseID* │ Grade │
├─────────────┼──────────┼───────┤
│      1      │   101    │   A   │
│      1      │   102    │   B   │
│      2      │   101    │   B   │
└─────────────┴──────────┴───────┘

🔑 Primary Key: (StudentID, CourseID)
📌 Functional Dependency: (StudentID, CourseID) → Grade ✅
```

## **SQL for 3NF:**
```sql
-- Table 1: Students
CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    StudentName VARCHAR(50) NOT NULL
);

INSERT INTO Students VALUES
(1, 'John'),
(2, 'Jane');

-- Table 2: Instructors (NEW!)
CREATE TABLE Instructors (
    Instructor VARCHAR(50) PRIMARY KEY,
    Department VARCHAR(50) NOT NULL
);

INSERT INTO Instructors VALUES
('Prof.Smith', 'CS'),
('Prof.Lee', 'CS'),
('Prof.Khan', 'IT');

-- Table 3: Courses (modified - Department removed)
CREATE TABLE Courses (
    CourseID INT PRIMARY KEY,
    CourseName VARCHAR(50) NOT NULL,
    Instructor VARCHAR(50),
    FOREIGN KEY (Instructor) REFERENCES Instructors(Instructor)
);

INSERT INTO Courses VALUES
(101, 'Databases', 'Prof.Smith'),
(102, 'Algorithms', 'Prof.Lee'),
(103, 'Networks', 'Prof.Khan'),
(104, 'AI/ML', 'Prof.Smith');

-- Table 4: Enrollments
CREATE TABLE Enrollments (
    StudentID INT,
    CourseID INT,
    Grade CHAR(1),
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

INSERT INTO Enrollments VALUES
(1, 101, 'A'),
(1, 102, 'B'),
(2, 101, 'B');
```

## **✅ 3NF Checklist:**
```
✅ In 2NF
✅ No transitive dependencies
✅ All non-key attributes depend ONLY on the primary key
✅ No non-key → non-key dependencies
```

---

# **🔹 STEP 4: Boyce-Codd Normal Form (BCNF)**

## **📜 Rules for BCNF:**
```
┌─────────────────────────────────────────────────────────────────┐
│                        BCNF RULES                               │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Must be in 3NF                                               │
│ ✅ For EVERY functional dependency X → Y:                       │
│    X must be a SUPERKEY                                         │
│                                                                 │
│ BCNF is STRICTER than 3NF:                                      │
│ ├── 3NF allows: Prime attribute can depend on non-superkey      │
│ └── BCNF forbids: ANY dependency where determinant is NOT       │
│                   a superkey                                    │
└─────────────────────────────────────────────────────────────────┘
```

## **🔍 Check Current Tables for BCNF:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BCNF CHECK FOR 3NF TABLES                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Table: Students                                                            │
│  ├── PK: StudentID                                                          │
│  ├── FD: StudentID → StudentName                                            │
│  └── Is StudentID a superkey? ✅ YES → BCNF satisfied                       │
│                                                                             │
│  Table: Instructors                                                         │
│  ├── PK: Instructor                                                         │
│  ├── FD: Instructor → Department                                            │
│  └── Is Instructor a superkey? ✅ YES → BCNF satisfied                      │
│                                                                             │
│  Table: Courses                                                             │
│  ├── PK: CourseID                                                           │
│  ├── FD: CourseID → CourseName, Instructor                                  │
│  └── Is CourseID a superkey? ✅ YES → BCNF satisfied                        │
│                                                                             │
│  Table: Enrollments                                                         │
│  ├── PK: (StudentID, CourseID)                                              │
│  ├── FD: (StudentID, CourseID) → Grade                                      │
│  └── Is (StudentID, CourseID) a superkey? ✅ YES → BCNF satisfied           │
│                                                                             │
│  🎉 ALL TABLES ARE IN BCNF!                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Our current 3NF tables are ALREADY in BCNF!** 🎉

---

## **📚 BCNF Violation Example (For Learning)**

To understand BCNF better, let's create a **scenario where 3NF ≠ BCNF**:

### **Scenario:**
```
- Students can have multiple advisors
- Each advisor advises ONLY ONE subject
- A student needs different advisors for different subjects
```

### **Student_Advisor Table (3NF but NOT BCNF):**
```
┌─────────────┬────────────┬─────────────┐
│ StudentID*  │  Subject*  │   Advisor   │
├─────────────┼────────────┼─────────────┤
│      1      │    Math    │  Dr.Brown   │
│      1      │  Physics   │  Dr.Green   │
│      2      │    Math    │  Dr.Brown   │
│      2      │  Chemistry │  Dr.White   │
│      3      │  Physics   │  Dr.Green   │
└─────────────┴────────────┴─────────────┘

🔑 Primary Key: (StudentID, Subject)
```

### **🔍 Analyze Functional Dependencies:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BCNF VIOLATION ANALYSIS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Primary Key: (StudentID, Subject)                                          │
│                                                                             │
│  Functional Dependencies:                                                   │
│  ┌────────────────────────────────┬──────────────────────────────────────┐  │
│  │         Dependency             │            BCNF Check                │  │
│  ├────────────────────────────────┼──────────────────────────────────────┤  │
│  │ (StudentID, Subject) → Advisor │ ✅ (StudentID, Subject) is superkey  │  │
│  │ Advisor → Subject              │ ❌ Advisor is NOT a superkey!        │  │
│  └────────────────────────────────┴──────────────────────────────────────┘  │
│                                                                             │
│  Why does Advisor → Subject exist?                                          │
│  ├── Dr.Brown ALWAYS advises Math                                           │
│  ├── Dr.Green ALWAYS advises Physics                                        │
│  └── Dr.White ALWAYS advises Chemistry                                      │
│                                                                             │
│  Problem:                                                                   │
│  ├── Advisor determines Subject                                             │
│  ├── But Advisor is NOT a superkey (not unique in table)                    │
│  └── This VIOLATES BCNF!                                                    │
│                                                                             │
│  Visual Representation:                                                     │
│                                                                             │
│       (StudentID, Subject)                                                  │
│              │                                                              │
│              ▼                                                              │
│           Advisor ──────────► Subject                                       │
│              │                   ▲                                          │
│              │                   │                                          │
│              └───────────────────┘                                          │
│                   ❌ BCNF Violation!                                        │
│                   Advisor is NOT a superkey                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **Why is this 3NF but NOT BCNF?**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         3NF vs BCNF                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  3NF allows:                                                                │
│  ├── Dependency where determinant is a superkey                             │
│  └── Dependency where dependent is a PRIME attribute (part of candidate key)│
│                                                                             │
│  In our case:                                                               │
│  ├── Advisor → Subject                                                      │
│  ├── Subject is PRIME (part of PK)                                          │
│  └── So 3NF is satisfied! ✅                                                │
│                                                                             │
│  BCNF requires:                                                             │
│  ├── For ALL dependencies X → Y                                             │
│  ├── X MUST be a superkey                                                   │
│  └── No exceptions!                                                         │
│                                                                             │
│  In our case:                                                               │
│  ├── Advisor → Subject                                                      │
│  ├── Advisor is NOT a superkey                                              │
│  └── BCNF is VIOLATED! ❌                                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **🔧 Action: Decompose to BCNF**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DECOMPOSITION TO BCNF                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  BEFORE (3NF - violates BCNF):                                              │
│                                                                             │
│  ┌─────────────┬────────────┬─────────────┐                                 │
│  │ StudentID*  │  Subject*  │   Advisor   │                                 │
│  └─────────────┴────────────┴─────────────┘                                 │
│         │            ▲             │                                        │
│         │            │             │                                        │
│         │            └─────────────┘                                        │
│         │           Advisor → Subject                                       │
│         │           (BCNF Violation)                                        │
│         │                                                                   │
│         │  Split based on the violating FD: Advisor → Subject               │
│         │                                                                   │
│         ▼                                                                   │
│                                                                             │
│  AFTER (BCNF):                                                              │
│                                                                             │
│  Table 1: Advisor_Subject          Table 2: Student_Advisor                 │
│  ┌────────────┬────────────┐       ┌─────────────┬────────────┐             │
│  │  Advisor*  │  Subject   │       │ StudentID*  │  Advisor*  │             │
│  └────────────┴────────────┘       └─────────────┴────────────┘             │
│         │                                   │                               │
│         │                                   │                               │
│         └───────────────────────────────────┘                               │
│                     Foreign Key                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **✅ BCNF Result Tables:**

### **Table 1: Advisor_Subject**
```
┌────────────┬────────────┐
│  Advisor*  │  Subject   │
├────────────┼────────────┤
│  Dr.Brown  │    Math    │
│  Dr.Green  │  Physics   │
│  Dr.White  │ Chemistry  │
└────────────┴────────────┘

🔑 Primary Key: Advisor
📌 FD: Advisor → Subject ✅ (Advisor IS a superkey now!)
```

### **Table 2: Student_Advisor**
```
┌─────────────┬────────────┐
│ StudentID*  │  Advisor*  │
├─────────────┼────────────┤
│      1      │  Dr.Brown  │
│      1      │  Dr.Green  │
│      2      │  Dr.Brown  │
│      2      │  Dr.White  │
│      3      │  Dr.Green  │
└─────────────┴────────────┘

🔑 Primary Key: (StudentID, Advisor)
📌 FD: (StudentID, Advisor) → ∅ ✅ (Superkey, no other attributes)
```

### **SQL for BCNF:**
```sql
-- Table 1: Advisor_Subject
CREATE TABLE Advisor_Subject (
    Advisor VARCHAR(50) PRIMARY KEY,
    Subject VARCHAR(50) NOT NULL
);

INSERT INTO Advisor_Subject VALUES
('Dr.Brown', 'Math'),
('Dr.Green', 'Physics'),
('Dr.White', 'Chemistry');

-- Table 2: Student_Advisor
CREATE TABLE Student_Advisor (
    StudentID INT,
    Advisor VARCHAR(50),
    PRIMARY KEY (StudentID, Advisor),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (Advisor) REFERENCES Advisor_Subject(Advisor)
);

INSERT INTO Student_Advisor VALUES
(1, 'Dr.Brown'),
(1, 'Dr.Green'),
(2, 'Dr.Brown'),
(2, 'Dr.White'),
(3, 'Dr.Green');
```

### **🔗 Query to Get Original View:**
```sql
SELECT 
    sa.StudentID,
    a.Subject,
    a.Advisor
FROM Student_Advisor sa
JOIN Advisor_Subject a ON sa.Advisor = a.Advisor
ORDER BY sa.StudentID;
```

**Result:**
```
┌─────────────┬────────────┬─────────────┐
│ StudentID   │  Subject   │   Advisor   │
├─────────────┼────────────┼─────────────┤
│      1      │    Math    │  Dr.Brown   │
│      1      │  Physics   │  Dr.Green   │
│      2      │    Math    │  Dr.Brown   │
│      2      │ Chemistry  │  Dr.White   │
│      3      │  Physics   │  Dr.Green   │
└─────────────┴────────────┴─────────────┘
```

### **✅ BCNF Checklist:**
```
✅ In 3NF
✅ Every determinant is a superkey
✅ No redundancy from functional dependencies
✅ Advisor_Subject: Advisor → Subject (Advisor is superkey) ✅
✅ Student_Advisor: (StudentID, Advisor) → ∅ (Composite key is superkey) ✅
```

---

# **📊 COMPLETE FINAL SUMMARY**

## **Normalization Journey:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE NORMALIZATION SUMMARY                           │
├───────┬─────────────────────────────────────────────────────────────────────┤
│       │                                                                     │
│  UNF  │  Raw data with multi-valued cells, repeating groups                 │
│       │                                                                     │
│       │  ↓ Make values atomic, define primary key                           │
│       │                                                                     │
├───────┼─────────────────────────────────────────────────────────────────────┤
│       │                                                                     │
│  1NF  │  ✅ Atomic values                                                   │
│       │  ✅ No repeating groups                                             │
│       │  ✅ Primary key defined                                             │
│       │                                                                     │
│       │  ↓ Remove PARTIAL dependencies                                      │
│       │                                                                     │
├───────┼─────────────────────────────────────────────────────────────────────┤
│       │                                                                     │
│  2NF  │  ✅ In 1NF                                                          │
│       │  ✅ No partial dependencies                                         │
│       │  ✅ Non-key attributes depend on ENTIRE PK                          │
│       │                                                                     │
│       │  ↓ Remove TRANSITIVE dependencies                                   │
│       │                                                                     │
├───────┼─────────────────────────────────────────────────────────────────────┤
│       │                                                                     │
│  3NF  │  ✅ In 2NF                                                          │
│       │  ✅ No transitive dependencies                                      │
│       │  ✅ No non-key → non-key dependencies                               │
│       │                                                                     │
│       │  ↓ Ensure every determinant is a SUPERKEY                           │
│       │                                                                     │
├───────┼─────────────────────────────────────────────────────────────────────┤
│       │                                                                     │
│ BCNF  │  ✅ In 3NF                                                          │
│       │  ✅ For every X → Y, X is a superkey                                │
│       │  ✅ Strictest form of normalization (commonly used)                 │
│       │                                                                     │
└───────┴─────────────────────────────────────────────────────────────────────┘
```

## **🗂️ Final Complete Schema (BCNF):**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FINAL BCNF SCHEMA                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                           ┌──────────────┐                                  │
│                           │   Students   │                                  │
│                           │──────────────│                                  │
│                           │ StudentID*   │                                  │
│                           │ StudentName  │                                  │
│                           └──────┬───────┘                                  │
│                                  │                                          │
│              ┌───────────────────┼───────────────────┐                      │
│              │                   │                   │                      │
│              ▼                   ▼                   ▼                      │
│  ┌───────────────────┐  ┌───────────────┐  ┌─────────────────┐              │
│  │  Student_Advisor  │  │  Enrollments  │  │                 │              │
│  │───────────────────│  │───────────────│  │                 │              │
│  │ StudentID* (FK)   │  │ StudentID*(FK)│  │                 │              │
│  │ Advisor* (FK)     │  │ CourseID*(FK) │  │                 │              │
│  └─────────┬─────────┘  │ Grade         │  │                 │              │
│            │            └───────┬───────┘  │                 │              │
│            │                    │          │                 │              │
│            ▼                    ▼          │                 │              │
│  ┌─────────────────┐    ┌─────────────┐    │                 │              │
│  │ Advisor_Subject │    │   Courses   │    │                 │              │
│  │─────────────────│    │─────────────│    │                 │              │
│  │ Advisor*        │    │ CourseID*   │    │                 │              │
│  │ Subject         │    │ CourseName  │    │                 │              │
│  └─────────────────┘    │ Instructor  │────┘                 │              │
│                         └──────┬──────┘                      │              │
│                                │                             │              │
│                                ▼                             │              │
│                        ┌──────────────┐                      │              │
│                        │ Instructors  │                      │              │
│                        │──────────────│                      │              │
│                        │ Instructor*  │                      │              │
│                        │ Department   │                      │              │
│                        └──────────────┘                      │              │
│                                                              │              │
└─────────────────────────────────────────────────────────────────────────────┘
```

# **📝 Complete SQL Script:**

```sql
-- =====================================================
-- COMPLETE BCNF NORMALIZED DATABASE SCHEMA
-- =====================================================

-- Drop tables if exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS Student_Advisor;
DROP TABLE IF EXISTS Enrollments;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Advisor_Subject;
DROP TABLE IF EXISTS Instructors;
DROP TABLE IF EXISTS Students;

-- =====================================================
-- TABLE 1: Students
-- =====================================================
CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    StudentName VARCHAR(50) NOT NULL
);

INSERT INTO Students VALUES
(1, 'John'),
(2, 'Jane'),
(3, 'Bob');

-- =====================================================
-- TABLE 2: Instructors
-- =====================================================
CREATE TABLE Instructors (
    Instructor VARCHAR(50) PRIMARY KEY,
    Department VARCHAR(50) NOT NULL
);

INSERT INTO Instructors VALUES
('Prof.Smith', 'CS'),
('Prof.Lee', 'CS'),
('Prof.Khan', 'IT');

-- =====================================================
-- TABLE 3: Courses
-- =====================================================
CREATE TABLE Courses (
    CourseID INT PRIMARY KEY,
    CourseName VARCHAR(50) NOT NULL,
    Instructor VARCHAR(50),
    FOREIGN KEY (Instructor) REFERENCES Instructors(Instructor)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

INSERT INTO Courses VALUES
(101, 'Databases', 'Prof.Smith'),
(102, 'Algorithms', 'Prof.Lee'),
(103, 'Networks', 'Prof.Khan'),
(104, 'AI/ML', 'Prof.Smith');

-- =====================================================
-- TABLE 4: Enrollments
-- =====================================================
CREATE TABLE Enrollments (
    StudentID INT,
    CourseID INT,
    Grade CHAR(1),
    EnrollmentDate DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

INSERT INTO Enrollments (StudentID, CourseID, Grade) VALUES
(1, 101, 'A'),
(1, 102, 'B'),
(2, 101, 'B'),
(2, 103, 'A'),
(3, 102, 'C');

-- =====================================================
-- TABLE 5: Advisor_Subject (for BCNF example)
-- =====================================================
CREATE TABLE Advisor_Subject (
    Advisor VARCHAR(50) PRIMARY KEY,
    Subject VARCHAR(50) NOT NULL
);

INSERT INTO Advisor_Subject VALUES
('Dr.Brown', 'Math'),
('Dr.Green', 'Physics'),
('Dr.White', 'Chemistry');

-- =====================================================
-- TABLE 6: Student_Advisor (for BCNF example)
-- =====================================================
CREATE TABLE Student_Advisor (
    StudentID INT,
    Advisor VARCHAR(50),
    PRIMARY KEY (StudentID, Advisor),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (Advisor) REFERENCES Advisor_Subject(Advisor)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

INSERT INTO Student_Advisor VALUES
(1, 'Dr.Brown'),
(1, 'Dr.Green'),
(2, 'Dr.Brown'),
(2, 'Dr.White'),
(3, 'Dr.Green');

-- =====================================================
-- USEFUL QUERIES
-- =====================================================

-- Query 1: Get complete student enrollment information
SELECT 
    s.StudentID,
    s.StudentName,
    c.CourseID,
    c.CourseName,
    i.Instructor,
    i.Department,
    e.Grade
FROM Students s
JOIN Enrollments e ON s.StudentID = e.StudentID
JOIN Courses c ON e.CourseID = c.CourseID
JOIN Instructors i ON c.Instructor = i.Instructor
ORDER BY s.StudentID, c.CourseID;

-- Query 2: Get student-advisor information with subjects
SELECT 
    s.StudentID,
    s.StudentName,
    sa.Advisor,
    a.Subject
FROM Students s
JOIN Student_Advisor sa ON s.StudentID = sa.StudentID
JOIN Advisor_Subject a ON sa.Advisor = a.Advisor
ORDER BY s.StudentID;

-- Query 3: Count students per course
SELECT 
    c.CourseID,
    c.CourseName,
    c.Instructor,
    COUNT(e.StudentID) AS StudentCount
FROM Courses c
LEFT JOIN Enrollments e ON c.CourseID = e.CourseID
GROUP BY c.CourseID, c.CourseName, c.Instructor;

-- Query 4: Get students with their grades and instructors
SELECT 
    s.StudentName,
    c.CourseName,
    e.Grade,
    i.Instructor,
    i.Department
FROM Students s
INNER JOIN Enrollments e ON s.StudentID = e.StudentID
INNER JOIN Courses c ON e.CourseID = c.CourseID
INNER JOIN Instructors i ON c.Instructor = i.Instructor
WHERE e.Grade IN ('A', 'B')
ORDER BY e.Grade, s.StudentName;

-- Query 5: Find all courses taught by CS department
SELECT 
    c.CourseID,
    c.CourseName,
    i.Instructor
FROM Courses c
JOIN Instructors i ON c.Instructor = i.Instructor
WHERE i.Department = 'CS';
```

---

## **📊 Query Results:**

### **Query 1 Result: Complete Student Enrollment**
```
┌───────────┬─────────────┬──────────┬────────────┬────────────┬────────────┬───────┐
│ StudentID │ StudentName │ CourseID │ CourseName │ Instructor │ Department │ Grade │
├───────────┼─────────────┼──────────┼────────────┼────────────┼────────────┼───────┤
│     1     │    John     │   101    │ Databases  │ Prof.Smith │     CS     │   A   │
│     1     │    John     │   102    │ Algorithms │ Prof.Lee   │     CS     │   B   │
│     2     │    Jane     │   101    │ Databases  │ Prof.Smith │     CS     │   B   │
│     2     │    Jane     │   103    │ Networks   │ Prof.Khan  │     IT     │   A   │
│     3     │    Bob      │   102    │ Algorithms │ Prof.Lee   │     CS     │   C   │
└───────────┴─────────────┴──────────┴────────────┴────────────┴────────────┴───────┘
```

### **Query 2 Result: Student-Advisor Information**
```
┌───────────┬─────────────┬───────────┬───────────┐
│ StudentID │ StudentName │  Advisor  │  Subject  │
├───────────┼─────────────┼───────────┼───────────┤
│     1     │    John     │ Dr.Brown  │   Math    │
│     1     │    John     │ Dr.Green  │  Physics  │
│     2     │    Jane     │ Dr.Brown  │   Math    │
│     2     │    Jane     │ Dr.White  │ Chemistry │
│     3     │    Bob      │ Dr.Green  │  Physics  │
└───────────┴─────────────┴───────────┴───────────┘
```

---

## **🔑 Key Concepts Summary Table:**

```
┌──────────┬─────────────────────────────────────────────────────────────────────┐
│  Normal  │                                                                     │
│   Form   │                         Key Rule                                    │
├──────────┼─────────────────────────────────────────────────────────────────────┤
│          │                                                                     │
│   1NF    │  • Atomic values (no multi-valued cells)                            │
│          │  • No repeating groups                                              │
│          │  • Primary key defined                                              │
│          │                                                                     │
├──────────┼─────────────────────────────────────────────────────────────────────┤
│          │                                                                     │
│   2NF    │  • Must be in 1NF                                                   │
│          │  • No PARTIAL dependencies                                          │
│          │  • Non-key depends on ENTIRE primary key                            │
│          │                                                                     │
├──────────┼─────────────────────────────────────────────────────────────────────┤
│          │                                                                     │
│   3NF    │  • Must be in 2NF                                                   │
│          │  • No TRANSITIVE dependencies                                       │
│          │  • No non-key → non-key dependencies                                │
│          │                                                                     │
├──────────┼─────────────────────────────────────────────────────────────────────┤
│          │                                                                     │
│   BCNF   │  • Must be in 3NF                                                   │
│          │  • Every determinant must be a SUPERKEY                             │
│          │  • Strictest practical normal form                                  │
│          │                                                                     │
└──────────┴─────────────────────────────────────────────────────────────────────┘
```

---

## **🎯 Quick Reference - Dependency Types:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DEPENDENCY TYPES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. PARTIAL DEPENDENCY (Violates 2NF)                                       │
│     ─────────────────────────────────                                       │
│     • Non-key attribute depends on PART of composite primary key            │
│     • Example: (StudentID, CourseID) is PK                                  │
│                StudentID → StudentName  ❌ (only part of PK)                │
│                                                                             │
│  2. TRANSITIVE DEPENDENCY (Violates 3NF)                                    │
│     ────────────────────────────────────                                    │
│     • Non-key attribute depends on another non-key attribute                │
│     • Example: CourseID → Instructor → Department                           │
│                CourseID → Department (via Instructor) ❌                    │
│                                                                             │
│  3. NON-SUPERKEY DETERMINANT (Violates BCNF)                                │
│     ────────────────────────────────────────                                │
│     • A non-superkey determines another attribute                           │
│     • Example: PK is (StudentID, Subject)                                   │
│                Advisor → Subject ❌ (Advisor is not superkey)               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## **✅ Benefits of Normalization:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     BENEFITS OF NORMALIZATION                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ✅ Eliminates Data Redundancy                                              │
│     • Each fact stored only once                                            │
│     • Saves storage space                                                   │
│                                                                             │
│  ✅ Prevents Update Anomalies                                               │
│     • Change data in one place only                                         │
│     • No inconsistent data                                                  │
│                                                                             │
│  ✅ Prevents Insert Anomalies                                               │
│     • Can add new entities independently                                    │
│     • No need for placeholder data                                          │
│                                                                             │
│  ✅ Prevents Delete Anomalies                                               │
│     • Deleting one entity doesn't lose other data                           │
│     • Data integrity maintained                                             │
│                                                                             │
│  ✅ Better Data Integrity                                                   │
│     • Foreign key constraints                                               │
│     • Referential integrity enforced                                        │
│                                                                             │
│  ✅ Easier Maintenance                                                      │
│     • Simpler, focused tables                                               │
│     • Clear relationships                                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## **⚠️ When to Denormalize:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     WHEN TO DENORMALIZE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Consider denormalization when:                                             │
│                                                                             │
│  📊 Data Warehouses / OLAP Systems                                          │
│     • Read-heavy operations                                                 │
│     • Complex analytical queries                                            │
│     • Star/Snowflake schemas                                                │
│                                                                             │
│  ⚡ Performance Critical Applications                                       │
│     • Frequent JOINs causing slowdowns                                      │
│     • Real-time reporting needs                                             │
│     • High-traffic read operations                                          │
│                                                                             │
│  💾 Caching Layers                                                          │
│     • Pre-computed aggregations                                             │
│     • Materialized views                                                    │
│     • Summary tables                                                        │
│                                                                             │
│  Best Practice:                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  NORMALIZE first → Measure performance → DENORMALIZE selectively    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

**🎉 NORMALIZATION COMPLETE: UNF → 1NF → 2NF → 3NF → BCNF** 
