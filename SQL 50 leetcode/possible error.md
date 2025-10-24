```sql
select unique_id, name from a 
left join b
on a.id = b.id;

-- where a.id = b.id is error

-- left join takes all values from the left table, where no matches, then assigns a null value
-- join(inner join) --> use 'on'
-- 'join' without 'on' condition, it is Equivalent to CROSS JOIN
````

<img width="796" height="141" alt="image" src="https://github.com/user-attachments/assets/6e8cafb4-dff2-494c-af5e-b0d91420732a" />
<img width="827" height="224" alt="image" src="https://github.com/user-attachments/assets/cb312faf-7d37-4080-8ef1-8e9296d44f2a" />


## use of count(*) without 'group by'
<img width="956" height="570" alt="image" src="https://github.com/user-attachments/assets/1cb2fa92-0b1c-44c6-8787-88a0fd1fa8bc" />

### 🔹 Example Table: `orders`

| id | customer | product | region | amount |
|----|-----------|----------|---------|--------|
| 1  | Alice     | Phone    | East    | 500    |
| 2  | Alice     | Laptop   | East    | 900    |
| 3  | Bob       | Phone    | West    | 300    |
| 4  | Bob       | Laptop   | West    | 700    |
| 5  | Alice     | Phone    | East    | 400    |
| 6  | Bob       | Phone    | East    | 200    |

✅ **Result:**

| customer | product | total_spent |
|-----------|----------|-------------|
| Alice     | Laptop   | 900         |
| Alice     | Phone    | 900  (500 + 400) |
| Bob       | Laptop   | 700         |
| Bob       | Phone    | 500  (300 + 200)   | 


# cross join using select * from table1, table2.
<img width="740" height="287" alt="image" src="https://github.com/user-attachments/assets/0246cc52-f843-4d41-9733-222acb169dc4" />



