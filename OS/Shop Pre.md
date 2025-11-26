Great choice — OS (Operating Systems) questions are **very common in job exams and interviews**. Below are **OS-related questions with clear, exam-ready answers**, suitable for **backend/full-stack roles (like ShopUp)**.

---

# ✅ 1. What is an Operating System?

**Q:** What is an Operating System (OS)?
✅ **Answer:**
An Operating System is system software that:

* Acts as an **intermediary between users and hardware**
* Manages **CPU, memory, storage, I/O devices**
* Provides **process management, file systems, networking, and security**

📌 Examples: Linux, Windows, macOS, Android, iOS.

---

# ✅ 2. Process vs Thread

**Q:** Difference between Process and Thread?

| Process              | Thread                           |
| -------------------- | -------------------------------- |
| Independent program  | Lightweight sub-process          |
| Has its own memory   | Shares memory with other threads |
| Heavy context switch | Lightweight context switch       |
| More secure          | Less secure                      |

✅ **Key point:** Threads are faster, but processes are safer.

---

# ✅ 3. User Space vs Kernel Space

**Q:** What is user space and kernel space?

✅ **Answer:**

* **User space:** Runs normal programs (browser, backend server).
* **Kernel space:** Runs OS core code (memory, CPU, device drivers).
* Programs use **system calls** to move from user → kernel.

---

# ✅ 4. CPU Scheduling Algorithms

**Q:** What are common CPU scheduling algorithms?

✅ **Answer:**

1. **FCFS** – First Come First Serve
2. **SJF** – Shortest Job First
3. **Round Robin** – Time slicing
4. **Priority Scheduling**
5. **Multilevel Queue Scheduling**

✅ **Best for time-sharing systems:** Round Robin

---

# ✅ 5. Deadlock

**Q:** What is deadlock?

✅ **Answer:**
Deadlock occurs when:

* Two or more processes wait indefinitely for resources held by each other.

✅ **Necessary conditions (Coffman Conditions):**

1. Mutual Exclusion
2. Hold and Wait
3. No Preemption
4. Circular Wait

✅ **Deadlock prevention:** Break any one of these conditions.

---

# ✅ 6. Virtual Memory

**Q:** What is Virtual Memory?

✅ **Answer:**
Virtual memory allows a system to:

* Use **disk as extra RAM**
* Run programs **larger than physical memory**
* Implemented using **paging and swapping**

✅ **Benefits:** Better memory utilization, isolation, and multitasking.

---

# ✅ 7. Paging vs Segmentation

**Q:** Difference between paging and segmentation?

| Paging                    | Segmentation            |
| ------------------------- | ----------------------- |
| Fixed-size blocks         | Variable-size blocks    |
| Hardware-managed          | Logical program-based   |
| No external fragmentation | Can cause fragmentation |

---

# ✅ 8. Context Switching

**Q:** What is context switching?

✅ **Answer:**
Switching the CPU from one process/thread to another by saving and restoring CPU state.

✅ **Overhead:** Yes (registers, stack, cache)

---

# ✅ 9. Starvation vs Deadlock

| Deadlock                       | Starvation                 |
| ------------------------------ | -------------------------- |
| Process is permanently blocked | Process waits indefinitely |
| Cause: circular waiting        | Cause: low priority        |
| System-wide issue              | Scheduling issue           |

---

# ✅ 10. Thrashing

**Q:** What is thrashing?

✅ **Answer:**
Thrashing occurs when:

* System spends **most of the time swapping pages** instead of executing processes.

✅ **Fix:** Increase RAM, reduce multiprogramming.

---

# ✅ 11. Mutex vs Semaphore

✅ **Mutex**

* Lock for **mutual exclusion**
* One process at a time

✅ **Semaphore**

* Counter-based synchronization
* Multiple processes allowed

---

# ✅ 12. System Call

**Q:** What is a system call?

✅ **Answer:**
System call is a way for a program to request a service from the OS.

📌 Examples:

* `fork()`, `exec()`, `read()`, `write()`, `open()`

---

# ✅ 13. Fork vs Exec

| fork()                | exec()                   |
| --------------------- | ------------------------ |
| Creates a new process | Replaces current process |
| Returns twice         | Never returns on success |

---

# ✅ 14. Page Fault

**Q:** What is a page fault?

✅ **Answer:**
Occurs when a program accesses a page that is not currently in RAM.

✅ OS loads the page from disk into RAM.

---

# ✅ 15. Why Linux is Preferred for Servers?

✅ Open-source
✅ Secure
✅ Excellent networking
✅ High stability
✅ Great for containers & cloud

---

# ✅ 16. Kernel Types

| Type        | Example        |
| ----------- | -------------- |
| Monolithic  | Linux          |
| Microkernel | Minix          |
| Hybrid      | Windows, macOS |

---

# ✅ 17. Multitasking vs Multithreading

* **Multitasking:** Multiple processes at the same time
* **Multithreading:** Multiple threads inside one process

---

# ✅ 18. What is a Zombie Process?

✅ A process that:

* Finished execution
* Still has entry in process table
* Parent has not called `wait()`

---

# ✅ 19. What is an Orphan Process?

✅ A process whose parent is terminated before it completes. It is adopted by `init`/`systemd`.

---

# ✅ 20. Real-World Linux Question (Important)

**Q:** What is the difference between `ps`, `top`, and `htop`?

* `ps` → Snapshot of processes
* `top` → Live terminal process monitor
* `htop` → Better UI alternative of top

---

# ✅ BONUS: ShopUp-Relevant OS Question

**Q:** How does OS help a backend server handle 100k concurrent users?

✅ Through:

* Multithreading & multi-processing
* CPU scheduling
* Virtual memory
* Efficient I/O using epoll
* Load balancing across cores

---

If you want, I can now also provide:
✅ **Advanced OS interview questions (for backend engineers)**
✅ **Linux command-based questions with answers**
✅ **MCQ OS exam questions (with solutions)**

Tell me what level you want:
👉 **Basic / Intermediate / Advanced / MCQ / Linux Practical**
