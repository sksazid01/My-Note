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
