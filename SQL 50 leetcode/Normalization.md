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
