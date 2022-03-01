CREATE TABLE public.expense_category
(
  id serial,
  name character varying(50),
  user_id integer,
  company_id integer,
  CONSTRAINT expense_category_pkey PRIMARY KEY (id),
  CONSTRAINT expense_category_company_id_fkey FOREIGN KEY (company_id)
      REFERENCES public.company (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT expense_category_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES public.users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)