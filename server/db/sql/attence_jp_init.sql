create or replace view v_project_mark  as
select 
  m.pid, 
  p.proj_name,
  p.proj_tech, 
  CASE m.mark_code WHEN 0 THEN 90 WHEN 1 THEN 80  WHEN 2 THEN 70 ELSE 60 END as code,
  CASE m.mark_fun WHEN 0 THEN 90 WHEN 1 THEN 80   WHEN 2 THEN 70 ELSE 60 END as fun, 
  CASE m.mark_mem WHEN 0 THEN 90 WHEN 1 THEN 80   WHEN 2 THEN 70 ELSE 60 END as mem,  
  CASE m.mark_res WHEN 0 THEN 90 WHEN 1 THEN 80   WHEN 2 THEN 70 ELSE 60 END as res,  
  CASE m.mark_ppt WHEN 0 THEN 90 WHEN 1 THEN 80   WHEN 2 THEN 70 ELSE 60 END as ppt
  
from project p, mark m 
where p.id = m.pid 


create or replace view v_project  as
select 
  p.pid, 
  p.proj_name,
  p.proj_tech, 
  ROUND((p.code+p.fun+p.mem+p.res+p.ppt)/5) as ret
from v_project_mark p order by p.pid



create or replace view v_project_mark2  as
select 
  p.id, 
  p.proj_name,
  p.proj_tech, 
  ROUND( 
  (CASE m.mark_code WHEN 0 THEN 90 WHEN 1 THEN 80  WHEN 2 THEN 70 WHEN 3 THEN 60 ELSE 0 END +
  CASE m.mark_fun WHEN 0 THEN 90 WHEN 1 THEN 80   WHEN 2 THEN 70 WHEN 3 THEN 60 ELSE 0 END +
  CASE m.mark_mem WHEN 0 THEN 90 WHEN 1 THEN 80   WHEN 2 THEN 70 WHEN 3 THEN 60 ELSE 0 END + 
  CASE m.mark_res WHEN 0 THEN 90 WHEN 1 THEN 80   WHEN 2 THEN 70 WHEN 3 THEN 60 ELSE 0 END +  
  CASE m.mark_ppt WHEN 0 THEN 90 WHEN 1 THEN 80   WHEN 2 THEN 70 WHEN 3 THEN 60 ELSE 0 END )/5) as ret
from project p
left JOIN mark m 
on p.id = m.pid
order by p.id